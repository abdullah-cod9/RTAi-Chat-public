"use server";
import { validate as isUUID } from "uuid";
import {
  eq,
  desc,
  and,
  aliasedTable,
  cosineDistance,
  sql,
  gt,
  or,
  inArray,
} from "drizzle-orm";

import {
  accounts,
  messages,
  chats,
  embeddingDoc,
  chatFolders,
  attachments,
  group,
  folder,
  subscribers,
} from "@/db/schema";

import { db } from "@/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { generateEmbedding } from "@/lib/embeddings";
import { addFriendSchema, ChatNameSchema } from "@/zod/schema";
import { z } from "zod";
import {
  Parts,
  SupportedDocumentTypes,
  supportedDocumentTypes,
} from "@/lib/myTypes";
import { imagePrice, ModelsType, price } from "@/models/settings";
import { revalidatePath } from "next/cache";
import { userCache } from "../caches/action";
import { isToday, isYesterday, subDays } from "date-fns";
import { revalidate } from "../other/action";
import { FeaturesPlan, planCredits, plus_plan } from "@/subscription";
const replies = aliasedTable(messages, "replies");

export async function saveUserMessage(
  userId: string,
  uuid: string,
  chatId: string,
  userMessage: Parts[],
  parentMessageId: string | null,
  att:
    | {
        id: string;
        fileName: string;
        filePath: string;
        fileSize: number;
        type:
          | "pdf"
          | "webp"
          | "gif"
          | "jpeg"
          | "png"
          | "docx"
          | "pptx"
          | "xlsx"
          | "txt"
          | "jpg";
      }[]
    | null,
) {
  await userCache(userId);
  try {
    await db.transaction(async (db) => {
      await db.insert(messages).values({
        id: uuid,
        chatId: chatId,
        userId,
        parts: userMessage,
        role: "user",
        parentMessageId,
      });
      if (att && att.length > 0) {
        await db.insert(attachments).values([
          ...att.map((a) => ({
            id: a.id,
            messageId: uuid,
            chatId: chatId,
            createdBy: userId,
            fileType: a.type,
            fileName: a.fileName,
            filePath: a.filePath,
            fileSize: a.fileSize,
            isForRAG: false,
          })),
        ]);
      }
    });
  } catch (error) {
    console.error("Failed to save message or reply:", error);
  }
}

export async function saveAssistantMessage(
  userId: string,
  uuid: string,
  chatId: string,
  parts: Parts[],
  model: ModelsType,
) {
  await userCache(userId);

  await db.insert(messages).values({
    id: uuid,
    chatId: chatId,
    userId: userId,
    parts,
    role: "assistant",
    parentMessageId: null,
    model,
  });
}

export async function addFriend(
  userId: string,
  values: z.infer<typeof addFriendSchema>,
  chatId: string,
  userPublicId: string,
  MAX_MEMBERS: number,
) {
  await userCache(userId);
  const result = addFriendSchema.safeParse(values);
  if (!result.success) {
    return { error: { message: result.error.flatten().fieldErrors.userId } };
  }
  const friendPublicId = result.data.userId;
  if (!friendPublicId || !isUUID(friendPublicId.trim())) {
    return {
      error: {
        message: "Invalid user ID format. Please provide a valid UUID.",
      },
    };
  }
  if (userPublicId === friendPublicId) {
    return { error: { message: "You cannot add yourself as a member." } };
  }
  try {
    const [isFriendPublicIdValid, groupId] = await Promise.all([
      db
        .select({
          publicId: accounts.publicId,
        })
        .from(accounts)
        .where(eq(accounts.publicId, friendPublicId)),
      db
        .select({ id: group.chatId })
        .from(group)
        .where(eq(group.chatId, chatId)),
    ]);
    if (isFriendPublicIdValid.length === 0) {
      return {
        error: {
          message:
            "Failed to add member. Please verify the user ID and try again.",
        },
      };
    }

    // create group
    if (!chatId || !userPublicId || !friendPublicId) {
      return { error: { message: "Missing required parameters." } };
    }
    if (groupId.length === 0) {
      // Create a new group chat if it doesn't exist
      await db.transaction(async (tx) => {
        await Promise.all([
          tx.insert(group).values([
            {
              chatId,
              createdBy: userPublicId,
              role: "admin",
            },
            {
              chatId,
              createdBy: friendPublicId,
              role: "user",
            },
          ]),
          tx.update(chats).set({ type: "public" }).where(eq(chats.id, chatId)),
        ]);
      });
    } else {
      // Add friend to an existing group chat

      const [groupMembers, existingFriend] = await Promise.all([
        db
          .select({ chatId: group.chatId })
          .from(group)
          .where(eq(group.chatId, chatId)),
        db
          .select({ friendPublicId: group.createdBy })
          .from(group)
          .where(
            and(eq(group.chatId, chatId), eq(group.createdBy, friendPublicId)),
          ),
      ]);
      if (groupMembers.length === MAX_MEMBERS) {
        return {
          error: {
            message: `The group can only have ${MAX_MEMBERS} members. Please remove one to add a new member.`,
          },
        };
      }

      if (existingFriend.length > 0) {
        return { error: { message: "This user already exists." } };
      }

      await db.insert(group).values({
        chatId,
        createdBy: friendPublicId,
        role: "user",
      });
    }

    return { success: { message: "Member added successfully" } };
  } catch (error) {
    console.error("Error in addFriendAction:", error);
    return {
      error: {
        message: "Failed to add member",
      },
    };
  }
}
export type InitialMessage = {
  id: string;
  content: string;
  parts: Parts[];
  role: "user" | "assistant";
  model: string | null;
  createdAt: Date;
  createdBy: string;
  publicId: string;
  username: string;
  avatarUrl: string;
  replyToMessage: { type: "text"; text: string }[] | null;
  replyToMessageId: string | null;
  userAttachments: UserAttachments[] | null;
}[];
type UserAttachments = {
  fileName: string;
  filePath: string;
  fileType:
    | "pdf"
    | "webp"
    | "gif"
    | "jpeg"
    | "png"
    | "docx"
    | "pptx"
    | "xlsx"
    | "txt";
  text: string | null;
};
export const getInitialMessage = async (
  chatId: string,
): Promise<InitialMessage> => {
  const query = await db
    .select({
      id: messages.id,
      parts: messages.parts,
      role: messages.role,
      model: messages.model,
      createdBy: messages.userId,
      publicId: accounts.publicId,
      username: accounts.username,
      avatarUrl: accounts.avatarUrl,
      replyToMessage: replies.parts,
      replyToMessageId: replies.id,
      userAttachments: sql<UserAttachments[]>`CASE 
    WHEN COUNT(attachments.file_path) > 0 THEN 
      array_agg(
        json_build_object(
          'id', attachments.id,
          'fileName', attachments.file_name,
          'filePath', attachments.file_path,
          'fileType', attachments.file_type,
          'fileSize', attachments.file_size
        )
      )
    ELSE 
      null
  END`,
    })
    .from(messages)
    .rightJoin(accounts, eq(messages.userId, accounts.id))
    .leftJoin(replies, eq(messages.parentMessageId, replies.id))

    .leftJoin(attachments, eq(messages.id, attachments.messageId))
    .where(eq(messages.chatId, chatId))
    .groupBy(messages.id, accounts.id, replies.parts, replies.id) // تأكد من تجميع الحقول الصحيحة
    .orderBy(messages.createdAt);

  //   const formattedQuery:InitialMessage = query.map((row) => ({
  //     ...row,
  // userAttachments: row
  //   }));

  return query as unknown as InitialMessage;
};

export async function deleteChat(
  userId: string,
  publicId: string,
  chatId: string,
) {
  await userCache(userId);

  const supabase = await createClient();
  const groupRole = await db
    .select({ role: group.role, publicId: group.createdBy })
    .from(group)
    .where(and(eq(group.chatId, chatId)));

  if (groupRole.length > 0) {
    if (groupRole.find((g) => g.publicId === publicId)?.role === "admin") {
      await db.transaction(async (tx) => {
        const att = await tx
          .select({ filePath: attachments.filePath })
          .from(attachments)
          .where(eq(attachments.chatId, chatId));
        await supabase.storage
          .from(process.env.SUPABASE_BUCKETS_NAME!)
          .remove(att.map((p) => p.filePath));

        await tx
          .delete(chats)
          .where(and(eq(chats.id, chatId), eq(chats.createdBy, userId)));
      });

      return { success: { message: "Group chat deleted successfully." } };
    } else {
      // ❌ المستخدم ليس أدمن، يقوم بحذف نفسه ورسائله فقط
      await db.transaction(async (tx) => {
        await Promise.all([
          tx
            .delete(messages)
            .where(
              and(eq(messages.chatId, chatId), eq(messages.userId, userId)),
            ),
          tx
            .delete(group)
            .where(
              and(eq(group.chatId, chatId), eq(group.createdBy, publicId)),
            ),
          groupRole.length === 2
            ? tx
                .update(chats)
                .set({ type: "private" })
                .where(eq(chats.id, chatId))
            : Promise.resolve(),
          groupRole.length === 2
            ? tx.delete(group).where(and(eq(group.chatId, chatId)))
            : Promise.resolve(),
        ]);
      });

      return {
        success: {
          message: "You left the group, and your messages were deleted.",
        },
      };
    }
  } else {
    // ❌ المستخدم ليس في مجموعة الدردشة، حذف الدردشة العادية
    await db.transaction(async (tx) => {
      const att = await tx
        .select({ filePath: attachments.filePath })
        .from(attachments)
        .where(eq(attachments.chatId, chatId));
      await supabase.storage
        .from(process.env.SUPABASE_BUCKETS_NAME!)
        .remove(att.map((p) => p.filePath));

      await tx.delete(chats).where(eq(chats.id, chatId));
    });
    return { success: { message: "Chat deleted successfully." } };
  }
}
export async function deleteFolder(
  userId: string,
  folderId: string,
  privateChatsId: string[],
  publicChatsId: string[],
  publicId: string,
) {
  await userCache(userId);

  const supabase = await createClient();

  await db.transaction(async (tx) => {
    const [groupRole] = await Promise.all([
      publicChatsId.length > 0
        ? tx
            .select({ role: group.role, chatId: group.chatId })
            .from(group)
            .where(
              and(
                inArray(group.chatId, publicChatsId),
                eq(group.createdBy, publicId),
              ),
            )
        : Promise.resolve([]),
      tx.transaction(async (tx) => {
        const att = await tx
          .select({ filePath: attachments.filePath })
          .from(attachments)
          .where(inArray(attachments.chatId, privateChatsId));
        await supabase.storage
          .from(process.env.SUPABASE_BUCKETS_NAME!)
          .remove(att.map((p) => p.filePath));

        await tx
          .delete(chats)
          .where(
            and(inArray(chats.id, privateChatsId), eq(chats.createdBy, userId)),
          );
      }),
      tx
        .delete(folder)
        .where(and(eq(folder.id, folderId), eq(folder.createdBy, userId))),
    ]);

    if (groupRole.length > 0) {
      const adminChatIds = groupRole
        .filter((r) => r.role === "admin")
        .map((r) => r.chatId);
      const memberChatIds = groupRole
        .filter((r) => r.role !== "admin")
        .map((r) => r.chatId);

      await Promise.all([
        // ✅ حذف جميع المحادثات حيث يكون المستخدم أدمن في استعلام واحد
        adminChatIds.length > 0
          ? tx.transaction(async (tx) => {
              const att = await tx
                .select({ filePath: attachments.filePath })
                .from(attachments)
                .where(inArray(attachments.chatId, publicChatsId));
              await supabase.storage
                .from(process.env.SUPABASE_BUCKETS_NAME!)
                .remove(att.map((p) => p.filePath));

              await tx
                .delete(chats)
                .where(
                  and(
                    inArray(chats.id, publicChatsId),
                    eq(chats.createdBy, userId),
                  ),
                );
            })
          : Promise.resolve(),

        // ✅ حذف جميع الرسائل والمستخدمين من المجموعات العامة في استعلامات مجمعة
        memberChatIds.length > 0
          ? tx.transaction(async (subTx) => {
              const att = await tx
                .select({ filePath: attachments.filePath })
                .from(attachments)
                .where(inArray(attachments.chatId, memberChatIds));
              await supabase.storage
                .from(process.env.SUPABASE_BUCKETS_NAME!)
                .remove(att.map((p) => p.filePath));
              subTx
                .delete(messages)
                .where(
                  and(
                    inArray(messages.chatId, memberChatIds),
                    eq(messages.userId, userId),
                  ),
                );
              subTx
                .delete(group)
                .where(
                  and(
                    inArray(group.chatId, memberChatIds),
                    eq(group.createdBy, publicId),
                  ),
                );
            })
          : Promise.resolve(),
      ]);
    }
  });
}
export async function deleteAttFromStorage(chatId: string | string[]) {
  const supabase = await createClient();

  try {
    return await db.transaction(async (tx) => {
      const att = await tx
        .select({ filePath: attachments.filePath })
        .from(attachments)
        .where(
          Array.isArray(chatId)
            ? inArray(attachments.chatId, chatId)
            : eq(attachments.chatId, chatId),
        );

      if (!att.length) {
        return { success: { message: "No attachments found to delete." } };
      }

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKETS_NAME!)
        .remove(att.map((p) => p.filePath.replace(/^files\//, "")));

      if (error) {
        console.error("Supabase Storage Error:", error.message);
        throw new Error("Failed to delete files from storage.");
      }

      return { success: { message: "Attachments deleted successfully." } };
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
    };
  }
}

export async function getMembers(
  userId: string,
  chatId: string,
): Promise<
  | {
      groupId: string;
      publicId: string;
      username: string;
      avatarUrl: string;
      role: "user" | "admin";
    }[]
  | null
> {
  await userCache(userId);

  try {
    const members = await db
      .select({
        groupId: group.chatId,
        publicId: accounts.publicId,
        username: accounts.username,
        avatarUrl: accounts.avatarUrl,
        role: group.role,
      })
      .from(group)
      .innerJoin(accounts, eq(group.createdBy, accounts.publicId))
      .where(eq(group.chatId, chatId))
      .orderBy(group.createdAt);
    return members.length > 0 ? members : null;
  } catch (error) {
    console.error(error);
    throw new Error("Error get members");
  }
}

export async function removeMemberFromGrope(
  userId: string,
  groupId: string,
  publicId: string,
  isLastMember: boolean,
) {
  await userCache(userId);

  try {
    await db.transaction(async (tx) => {
      const userId = await tx
        .select({ userId: accounts.id })
        .from(accounts)
        .where(eq(accounts.publicId, publicId));
      const res = await deleteAttFromStorage(groupId);
      if (res && "error" in res) {
        throw new Error(res.error.message);
      }

      await Promise.all([
        tx
          .delete(messages)
          .where(
            and(
              eq(messages.chatId, groupId),
              eq(messages.userId, userId[0].userId),
            ),
          ),
        tx
          .delete(group)
          .where(
            isLastMember
              ? eq(group.chatId, groupId)
              : and(eq(group.chatId, groupId), eq(group.createdBy, publicId)),
          ),
        ,
        isLastMember
          ? tx
              .update(chats)
              .set({ type: "private" })
              .where(eq(chats.id, groupId))
          : Promise.resolve(),
      ]);
    });
  } catch (error) {
    console.error("Error remove from grope:", error);
    throw new Error("Error remove member from grope");
  }
}
export type UsersDb = {
  userId: string;
  publicId: string;
  username: string;
  email: string | null;
  avatarUrl: string;
};
export async function getUser(userId: string): Promise<UsersDb> {
  console.log("getUser");

  const user = await db
    .select({
      userId: accounts.id,
      publicId: accounts.publicId,
      email: accounts.email,
      username: accounts.username,
      avatarUrl: accounts.avatarUrl,
    })
    .from(accounts)
    .where(eq(accounts.id, userId))
    .limit(1);

  if (!user.length) {
    redirect("/auth/403");
  }
  return user[0];
}

// export async function saveRAGAttachments(
//   id: string,
//   fileName: string,
//   userId: string,
//   filePath: string,
//   fileSize: number,
//   type: "pdf" | "image" | "office",
// ) {
//   await db.insert(attachments).values({
//     id,
//     createdBy: userId,
//     type,
//     fileName,
//     filePath,
//     fileSize,
//     isForRAG: true,
//   });
// }
export async function saveAttachments(
  userId: string,
  messageId: string | null,
  fileName: string,
  filePath: string,
  fileSize: number,
  type:
    | "pdf"
    | "webp"
    | "gif"
    | "jpeg"
    | "png"
    | "docx"
    | "pptx"
    | "xlsx"
    | "txt",
) {
  await userCache(userId);

  await db.insert(attachments).values({
    messageId,
    createdBy: userId,
    fileType: type,
    fileName,
    filePath,
    fileSize,
    isForRAG: false,
  });
}

export async function saveEmbedding(
  userId: string,
  fileName: string,
  filePath: string,
  fileSize: number,
  type: "pdf" | "docx" | "pptx" | "xlsx",
  embeddings: {
    embedding: number[];
    content: string;
  }[],
) {
  await userCache(userId);

  await db.transaction(async (tx) => {
    const attId = await tx
      .insert(attachments)
      .values({
        messageId: null,
        createdBy: userId,
        fileType: type,
        fileName,
        filePath,
        fileSize,
        isForRAG: true,
      })
      .returning({ id: attachments.id });
    await tx.insert(embeddingDoc).values(
      embeddings.map((e) => ({
        attachmentsId: attId[0].id,
        description: e.content,
        embedding: e.embedding,
      })),
    );
  });
}
export async function getPublicId(userId: string): Promise<string> {
  const PId = await db
    .select({ publicId: accounts.publicId })
    .from(accounts)
    .where(eq(accounts.id, userId));
  return PId[0].publicId;
}
export async function IsChatValid(
  userId: string,
  chatId: string,
  publicId: string,
) {
  const [chat, groupChat] = await Promise.all([
    db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.createdBy, userId)))
      .limit(1),
    db
      .select({ id: group.chatId })
      .from(group)
      .where(and(eq(group.chatId, chatId), eq(group.createdBy, publicId)))
      .limit(1),
  ]);
  if (!chat[0] && !groupChat[0]) {
    return redirect("/chat");
  }
  return groupChat.length > 0;
}
export type Chat = {
  id: string;
  name: string;
  createdAt: string;
  type: "private" | "public";
  role: "admin" | "user" | null; // حسب القيم في جدول group
};

export type ChatFolder = {
  id: string;
  name: string;
  createdAt: string;
  chats: Chat[]; // قائمة المحادثات داخل المجلد
};
export type ChatResult = ChatFolder | Chat;
export type ChatFolderGroup = {
  label: string;
  items: ChatResult[];
};

export async function getFoldersAndChats(
  userId: string,

  publicId: string,
): Promise<ChatFolderGroup[]> {
  await userCache(userId);

  const res = await db
    .selectDistinctOn([chats.id], {
      folderId: folder.id,
      folderName: folder.name,
      folderCreatedAt: folder.createdAt,
      chatId: chats.id,
      chatName: chats.name,
      chatCreatedAt: chats.createdAt,
      role: group.role,
      chatType: chats.type,
    })
    .from(chats)
    .leftJoin(chatFolders, eq(chats.id, chatFolders.chatId))
    .leftJoin(
      folder,
      and(eq(chatFolders.folderId, folder.id), eq(folder.createdBy, userId)),
    )
    .leftJoin(
      group,
      and(eq(chats.id, group.chatId), eq(group.createdBy, publicId)),
    )
    .where(or(eq(chats.createdBy, userId), eq(group.createdBy, publicId)))
    .orderBy(chats.id, desc(chats.createdAt)); // ترتيب البيانات

  const foldersMap = new Map();
  const uncategorizedChats: Chat[] = [];

  res.forEach((row) => {
    const {
      folderId,
      folderName,
      folderCreatedAt,
      role,
      chatId,
      chatName,
      chatCreatedAt,
      chatType,
    } = row;

    if (folderId) {
      if (!foldersMap.has(folderId)) {
        foldersMap.set(folderId, {
          id: folderId,
          name: folderName,
          createdAt: folderCreatedAt,
          chats: [],
        });
      }

      foldersMap.get(folderId).chats.push({
        id: chatId,
        name: chatName,
        createdAt: chatCreatedAt,
        type: chatType,
        role,
      });
    } else {
      uncategorizedChats.push({
        id: chatId,
        name: chatName,
        createdAt: chatCreatedAt,
        type: chatType,
        role,
      });
    }
  });

  const allChats: ChatResult[] = [
    ...[...foldersMap.values()],
    ...uncategorizedChats,
  ];

  // تصنيف حسب الوقت
  const now = new Date();
  const grouped: ChatFolderGroup[] = [
    { label: "today", items: [] },
    { label: "yesterday", items: [] },
    { label: "last_7_days", items: [] },
    { label: "last_30_days", items: [] },
    { label: "older", items: [] },
  ];

  allChats.forEach((item) => {
    const createdAt = new Date(item.createdAt);

    if (isToday(createdAt)) {
      grouped[0].items.push(item);
    } else if (isYesterday(createdAt)) {
      grouped[1].items.push(item);
    } else if (createdAt >= subDays(now, 7)) {
      grouped[2].items.push(item);
    } else if (createdAt >= subDays(now, 30)) {
      grouped[3].items.push(item);
    } else {
      grouped[4].items.push(item);
    }
  });

  // احذف الأقسام الفارغة إن أردت
  const result: ChatFolderGroup[] = grouped.filter((g) => g.items.length > 0);

  return result ?? [];
}

export async function findSimilar(
  userId: string,
  description: string,
  selectedKBId: string[],
) {
  const embedding = await generateEmbedding(userId, description);
  const similarity = sql<number>`1 - (${cosineDistance(embeddingDoc.embedding, embedding)})`;
  const similar = await db
    .select({ text: embeddingDoc.description, similarity })
    .from(embeddingDoc)
    .where(
      and(
        inArray(embeddingDoc.attachmentsId, selectedKBId),
        gt(similarity, 0.3),
      ),
    )
    .orderBy((t) => desc(t.similarity))
    .limit(3);

  return similar;
}

export async function chatToFolder(
  userId: string,
  chatId: string,
  targetFolderId: string,
) {
  await userCache(userId);

  try {
    await db.insert(chatFolders).values({
      chatId,
      folderId: targetFolderId,
      addedBy: userId,
    });
  } catch (error) {
    console.error(error);
    return { error: "chatToFolder" };
  }
}
export async function chatFromFolder2Folder(
  userId: string,

  formChatId: string,
  toFolderId: string,
  formFolderId: string,
  isLestChat: boolean,
) {
  await userCache(userId);

  try {
    await db.transaction(async (trx) => {
      await Promise.all([
        trx.insert(chatFolders).values({
          chatId: formChatId,
          folderId: toFolderId,
          addedBy: userId,
        }),
        trx
          .delete(chatFolders)
          .where(
            and(
              eq(chatFolders.folderId, formFolderId),
              eq(chatFolders.addedBy, userId),
              eq(chatFolders.chatId, formChatId),
            ),
          ),
        isLestChat
          ? trx
              .delete(folder)
              .where(
                and(eq(folder.createdBy, userId), eq(folder.id, formFolderId)),
              )
          : Promise.resolve(),
      ]);
    });
  } catch (error) {
    console.error(error);
    return { error: "change Chat Name" };
  }
}
export async function chatFromFolder2Menu(
  userId: string,

  formChatId: string,
  formFolderId: string,
  isLestChat: boolean,
) {
  await userCache(userId);

  try {
    await db.transaction(async (trx) => {
      await Promise.all([
        trx
          .delete(chatFolders)
          .where(
            and(
              eq(chatFolders.folderId, formFolderId),
              eq(chatFolders.addedBy, userId),
              eq(chatFolders.chatId, formChatId),
            ),
          ),
        isLestChat
          ? trx
              .delete(folder)
              .where(
                and(eq(folder.createdBy, userId), eq(folder.id, formFolderId)),
              )
          : Promise.resolve(),
      ]);
    });
  } catch (error) {
    console.error(error);
  }
}
export async function insetFolder(
  userId: string,

  draggedChatId: string,
  targetChatId: string,
  folderName: string,
): Promise<
  | {
      error: string;
    }
  | undefined
> {
  await userCache(userId);

  try {
    await db.transaction(async (tx) => {
      const insertedFolder = await tx
        .insert(folder)
        .values({ name: folderName, createdBy: userId })
        .returning({ folderId: folder.id });

      if (!insertedFolder.length) {
        throw new Error("Error creating folder");
      }

      await tx.insert(chatFolders).values([
        {
          chatId: targetChatId,
          folderId: insertedFolder[0].folderId,
          addedBy: userId,
        },
        {
          chatId: draggedChatId,
          folderId: insertedFolder[0].folderId,
          addedBy: userId,
        },
      ]);
    });
  } catch (error) {
    console.error(error);
    return { error: "insetFolder" + error };
  }
}
export async function changeChatName(
  userId: string,
  chatId: string,
  newName: string,
): Promise<
  | {
      error: string;
    }
  | undefined
> {
  await userCache(userId);

  try {
    await db.update(chats).set({ name: newName }).where(eq(chats.id, chatId));
  } catch (error) {
    console.error(error);
    return { error: "changeChatName" + error };
  }
}
export async function changeFolderName(
  userId: string,
  folderId: string,
  newName: string,
): Promise<
  | {
      error: string;
    }
  | undefined
> {
  await userCache(userId);

  try {
    await db
      .update(folder)
      .set({ name: newName })
      .where(eq(folder.id, folderId));
  } catch (error) {
    console.error(error);
    return { error: "change Chat Name" };
  }
}

export async function newChat(
  userId: string,

  values: unknown,
  targetFolderId: string | undefined,
) {
  await userCache(userId);

  const { data, success, error } = ChatNameSchema.safeParse(values);
  if (!success) {
    return {
      error: { message: error.flatten().formErrors.join("\n") },
    };
  }

  if (targetFolderId) {
    return await db.transaction(async (trx) => {
      const chat = await trx
        .insert(chats)
        .values({
          createdBy: userId,
          name: data.chatName,
        })
        .returning({ id: chats.id });

      await trx.insert(chatFolders).values({
        chatId: chat[0].id,
        folderId: targetFolderId,
        addedBy: userId,
      });
      return { success: { value: chat[0].id } };
    });
  } else {
    await db.insert(chats).values({
      createdBy: userId,
      name: data.chatName,
    });

    return { success: { message: "ok" } };
  }
}
export async function createFolder(userId: string, values: unknown) {
  await userCache(userId);

  const { data, success, error } = ChatNameSchema.safeParse(values);
  if (!success) {
    return {
      error: { message: error.flatten().fieldErrors.chatName as string[] },
    };
  }
  await db.insert(folder).values({
    createdBy: userId,
    name: data.chatName,
  });
}
export async function changeName(
  userId: string,

  values: unknown,
  chatId: string | undefined,
  folderId: string | undefined,
) {
  await userCache(userId);

  const { data, success, error } = ChatNameSchema.safeParse(values);
  if (!success) {
    return {
      error: { message: error.flatten().fieldErrors.chatName as string[] },
    };
  }
  if (chatId) {
    await db
      .update(chats)
      .set({
        name: data.chatName,
      })
      .where(and(eq(chats.id, chatId), eq(chats.createdBy, userId)));
    return {
      success: { message: "ok" },
    };
  }
  if (folderId) {
    await db
      .update(folder)
      .set({
        name: data.chatName,
      })
      .where(and(eq(folder.id, folderId), eq(folder.createdBy, userId)));
    return {
      success: { message: "ok" },
    };
  }
}
export type KBAttachments = {
  id: string;
  fileName: string;
  filePath: string;
  fileType: "pdf" | "docx" | "pptx" | "xlsx";
  fileSize: string;
  createdAt: string;
};
export async function getRAGAttachments(userId: string) {
  await userCache(userId);

  const results = await db
    .select({
      id: attachments.id,
      fileName: attachments.fileName,
      filePath: attachments.filePath,
      fileType: attachments.fileType,
      fileSize: attachments.fileSize,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .where(
      and(
        eq(attachments.createdBy, userId),
        eq(attachments.isForRAG, true),
        inArray(attachments.fileType, ["docx", "pdf", "pptx", "xlsx"] as const), // ✅ تحديد القيم كـ `as const`
      ),
    )
    .orderBy(desc(attachments.createdAt));

  return results as unknown as KBAttachments[];
}

export async function createChat(
  userId: string,

  q: string,
  name: string = "new chat",
  type: "private" | "public" = "private",
) {
  await userCache(userId);

  const res = await db
    .insert(chats)
    .values({
      name,
      createdBy: userId,
      type,
    })
    .returning({ id: chats.id });

  if (!res.length) return { error: { message: "Error create new chat" } };
  const { id } = res[0];
  console.log(id);
  redirect(`/chat/${id}?q=${encodeURIComponent(q)}`);
}

export async function deleteAtt(userId: string, idS: string[]) {
  await userCache(userId);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return redirect("/login");
  }
  try {
    await db.transaction(async (tx) => {
      const filePath = await tx
        .delete(attachments)
        .where(
          and(
            inArray(attachments.id, idS),
            eq(attachments.createdBy, data.user.id),
          ),
        )
        .returning({ filePath: attachments.filePath });
      await supabase.storage
        .from(process.env.SUPABASE_BUCKETS_NAME!)
        .remove(filePath.map((p) => p.filePath));
    });
  } catch (error) {
    console.error("Error while deleting attachments:", error);

    return {
      error: {
        message: "An unexpected error occurred while deleting attachments.",
      },
    };
  }
}

export async function calculateRemainingCredits(
  userId: string,
  model: ModelsType,
  inputTokens: number,
  outputTokens: number,
) {
  await userCache(userId);

  const _price = price.get(model);
  if (!_price) {
    throw new Error("model price is undefined");
  }
  const inputCost = (inputTokens / 1_000_000) * _price.input;
  const outputCost = (outputTokens / 1_000_000) * _price.output;
  const totalCost = inputCost + outputCost;
  const totalCostNumeric = Number(totalCost.toFixed(8));
  console.log("totalCost:", totalCost.toFixed(8));
  const res = await db.transaction(async (tx) => {
    const res = await tx
      .update(subscribers)
      .set({
        credits: sql`ROUND(GREATEST(${subscribers.credits} - ${totalCostNumeric}, 0), 8)`,
        featuresPlan: sql`
        jsonb_set(
          ${subscribers.featuresPlan},
          '{isActive}',
          CASE
            WHEN ${subscribers.credits} - ${totalCost} <= 0 THEN 'false'::jsonb
            ELSE 'true'::jsonb
          END,
          false
        )
      `,
      })
      .where(eq(subscribers.userId, userId))
      .returning({ isActive: subscribers.featuresPlan });
    return res[0].isActive;
  });
  return res;
}
export async function calculateImageTokens(
  userId: string,
  model: ModelsType,
  inputTokens: number,
  outputTokens: number,
) {
  await userCache(userId);

  const _price = imagePrice.get(model);
  if (!_price) {
    throw new Error("image price is undefined");
  }
  const inputCost = (inputTokens / 1_000_000) * _price.input;
  const outputCost = (outputTokens / 1_000_000) * _price.output;
  const totalCost = inputCost + outputCost;
  const totalCostNumeric = Number(totalCost.toFixed(8));
  console.log("totalCostImageTokens:", totalCost.toFixed(8));
  const res = await db.transaction(async (tx) => {
    const res = await tx
      .update(subscribers)
      .set({
        credits: sql`ROUND(GREATEST(${subscribers.credits} - ${totalCostNumeric}, 0), 8)`,
        featuresPlan: sql`
        jsonb_set(
          ${subscribers.featuresPlan},
          '{isActive}',
          CASE
            WHEN ${subscribers.credits} - ${totalCost} <= 0 THEN 'false'::jsonb
            ELSE 'true'::jsonb
          END,
          false
        )
      `,
      })
      .where(eq(subscribers.userId, userId))
      .returning({ isActive: subscribers.featuresPlan });
    return res[0].isActive;
  });
  return res;
}
export async function userUploadFile(userId: string) {
  await userCache(userId);

  await db.transaction(async (tx) => {
    await tx
      .update(subscribers)
      .set({
        featuresPlan: sql`
        jsonb_set(
          ${subscribers.featuresPlan},
          '{fileUploads}',
          (
        GREATEST(((${subscribers.featuresPlan})->>'fileUploads')::int - 1, 0)
      )::text::jsonb,
          false
        )
      `,
      })
      .where(eq(subscribers.userId, userId));
  });
}
export async function userGenerateImage(userId: string) {
  await userCache(userId);

  await db.transaction(async (tx) => {
    await tx
      .update(subscribers)
      .set({
        featuresPlan: sql`
        jsonb_set(
          ${subscribers.featuresPlan},
          '{imageGenerations}',
          (
        GREATEST(((${subscribers.featuresPlan})->>'imageGenerations')::int - 1, 0)
      )::text::jsonb,
          false
        )
      `,
      })
      .where(eq(subscribers.userId, userId));
  });
}

export async function getRemainingCredits(userId: string) {
  await userCache(userId);

  const credits = await db
    .select({
      credits: subscribers.credits,
    })
    .from(subscribers)
    .where(eq(subscribers.userId, userId));
  return credits[0].credits;
}

export async function setSubscription(
  plan: "plus",
  email: string,
  subscriptionId: string,
  nextBillingDate: string,
  createdAt: string,
) {
  const credits = planCredits.get(plan);
  if (!credits) {
    throw new Error("credits is undefined");
  }
  const updatedAt = new Date().toISOString();
  const id = await db
    .select({ userId: accounts.id })
    .from(accounts)
    .where(eq(accounts.email, email))
    .limit(1);
  try {
    await db
      .insert(subscribers)
      .values({
        userId: id[0].userId,
        subscriptionId,
        credits,
        subscriptionType: plan,
        featuresPlan: plus_plan,
        updatedAt,
        createdAt,
        nextBillingDate,
      })
      .onConflictDoUpdate({
        target: subscribers.userId,
        set: {
          credits,
          subscriptionId,
          subscriptionType: plan,
          updatedAt,
          featuresPlan: plus_plan,
          nextBillingDate,
        },
      });
    await revalidate();
  } catch (error) {
    console.error(error);
  }
}

export async function expiredSubscription(subscriptionId: string) {
  const now = new Date();
  const updatedAt = now.toISOString();

  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  nextDay.setUTCHours(3, 0, 0, 0);
  const nextBillingDate = nextDay.toISOString();
  const credits = planCredits.get("free");
  if (!credits) {
    throw new Error("credits is undefined");
  }
  try {
    await db
      .update(subscribers)
      .set({
        featuresPlan: sql`
        jsonb_set(
          jsonb_set(${subscribers.featuresPlan}, '{autoRenew}', 'false', false),
          '{isActive}', 'false', false
        )
      `,
        credits: credits,
        nextBillingDate,
        updatedAt,
        subscriptionId: null,
        subscriptionType: "free",
      })
      .where(eq(subscribers.subscriptionId, subscriptionId));
    await revalidate();
  } catch (error) {
    console.error(error);
  }
}
export async function cancelledSubscription(subscriptionId: string) {
  // const now = new Date();
  // const updatedAt = now.toISOString();

  // const nextDay = new Date(now);
  // nextDay.setDate(now.getDate() + 1);
  // nextDay.setUTCHours(3, 0, 0, 0);
  // const nextBillingDate = nextDay.toISOString();

  try {
    await db
      .update(subscribers)
      .set({
        featuresPlan: sql`jsonb_set(${subscribers.featuresPlan}, '{autoRenew}', 'false', false)`,
      })
      .where(eq(subscribers.subscriptionId, subscriptionId));
    await revalidate();
  } catch (error) {
    console.error(error);
  }
}
export async function pausedSubscription(subscriptionId: string) {
  const now = new Date();
  const updatedAt = now.toISOString();
  try {
    await db
      .update(subscribers)
      .set({
        featuresPlan: sql`jsonb_set(${subscribers.featuresPlan}, '{isActive}', 'false', false)`,
        updatedAt,
      })
      .where(eq(subscribers.subscriptionId, subscriptionId));
    await revalidate();
  } catch (error) {
    console.error(error);
  }
}
export async function onHoldSubscription(subscriptionId: string) {
  const now = new Date();
  const updatedAt = now.toISOString();
  try {
    await db
      .update(subscribers)
      .set({
        featuresPlan: sql`jsonb_set(${subscribers.featuresPlan}, '{isActive}', 'false', false)`,
        updatedAt,
      })
      .where(
        and(
          eq(subscribers.subscriptionId, subscriptionId),
          eq(subscribers.subscriptionType, "plus"),
        ),
      );
    await revalidate();
  } catch (error) {
    console.error(error);
  }
}
export type Plan = {
  subscriptionType: "free" | "plus" | "pro" | "enterprise";
  expiresAt: string;
  subscriptionId: string | null;
  featuresPlan: FeaturesPlan;
};
export async function getUserPlan(userId: string): Promise<Plan> {
  console.log("getUserPlan");
  const plan = await db
    .select({
      subscriptionType: subscribers.subscriptionType,
      expiresAt: subscribers.nextBillingDate,
      subscriptionId: subscribers.subscriptionId,
      featuresPlan: subscribers.featuresPlan,
    })
    .from(subscribers)
    .where(eq(subscribers.userId, userId));
  return plan[0];
}
export async function chiackUserPlan(userId: string) {
  const res = await db
    .select({
      featuresPlan: subscribers.featuresPlan,
    })
    .from(subscribers)
    .where(eq(subscribers.userId, userId))
    .limit(1);
  if (!res[0].featuresPlan.isActive) {
    revalidatePath("/", "layout");
  }
  return res[0];
}
export async function updateSubscription(subscriptionId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDay() + 1);
  const updatedAt = new Date().toISOString();
  const formattedExpiresAt = expiresAt.toISOString();
  await db
    .update(subscribers)
    .set({
      updatedAt,
      featuresPlan: sql`jsonb_set(${subscribers.featuresPlan}, '{isActive}', 'true', false)`,
      nextBillingDate: formattedExpiresAt,
      subscriptionId: null,
    })
    .where(eq(subscribers.subscriptionId, subscriptionId));
}
export async function calculationRemainingCredits(userId: string) {
  await userCache(userId);

  const plan = await db
    .select({
      credits: subscribers.credits,
      subscriptionType: subscribers.subscriptionType,
    })
    .from(subscribers)
    .where(eq(subscribers.userId, userId));

  const { credits: remainingCredits, subscriptionType } = plan[0];
  const credits = planCredits.get(subscriptionType);
  if (!credits) {
    throw new Error("credits is undefined");
  }

  const percentage =
    parseFloat(credits) > 0
      ? Math.min(
          100,
          Math.floor(
            (parseFloat(remainingCredits) / parseFloat(credits)) * 100,
          ),
        )
      : 0;
  return percentage;
}

export async function deleteAllChats(userId: string) {
  await userCache(userId);

  try {
    await db.transaction(async (tx) => {
      const att = await tx
        .select({ filePath: attachments.filePath })
        .from(attachments)
        .where(eq(attachments.createdBy, userId));
      const res = await deleteAttFromStorage(
        att.map((a) => a.filePath.replace(/^files\//, "")),
      );
      if ("error" in res) {
        throw new Error(res.error.message);
      }
      return Promise.all([
        tx.delete(chats).where(eq(chats.createdBy, userId)),
        tx.delete(folder).where(eq(folder.createdBy, userId)),
      ]);
    });
    return { success: { message: "ok" } };
  } catch (error) {
    console.error("Error while delete All Chats:", error);

    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function deleteAccount(userId: string) {
  await userCache(userId);

  const supabase = await createClient();
  try {
    const att = await db
      .select({
        filePath: attachments.filePath,
      })
      .from(attachments)
      .where(eq(attachments.createdBy, userId));
    if (att.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKETS_NAME!)
        .remove(att.map((a) => a.filePath));

      if (storageError) {
        return { error: { message: "Failed to delete user files." } };
      }
    }
    await supabase.rpc("delete_user");
    return { success: { message: "ok" } };
  } catch (error) {
    console.error("Error while delete Account:", error);

    return {
      error: {
        message: "An unexpected error occurred while deleting the account.",
      },
    };
  }
}
export async function deleteAttStorage(filePith: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKETS_NAME!)
    .remove(filePith);
  if (error) {
    throw new Error("Error delete attachments from storage");
  }
}
export async function isUsernameOrEmailExists(
  userName: string,
  email: string,
): Promise<{
  usernameExists: boolean;
  emailExists: boolean;
}> {
  const [isUsernameExists, isEmailExists] = await Promise.all([
    db
      .select({ username: accounts.username })
      .from(accounts)
      .where(and(eq(accounts.username, userName)))
      .limit(1),

    db
      .select({ email: accounts.email })
      .from(accounts)
      .where(and(eq(accounts.email, email)))
      .limit(1),
  ]);

  return {
    usernameExists: isUsernameExists.length > 0,
    emailExists: isEmailExists.length > 0,
  };
}

export async function getCAG(
  userId: string,
  ids: string[],
): Promise<
  {
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: "pdf" | "docx" | "pptx" | "xlsx";
    text: string;
  }[]
> {
  await userCache(userId);

  const att = await db
    .select({
      fileName: attachments.fileName,
      filePath: attachments.filePath,
      fileSize: attachments.fileSize,
      fileType: attachments.fileType,
      text: sql<string>`CASE 
      WHEN COUNT(${embeddingDoc.description}) > 0 THEN 
        string_agg(
          ${embeddingDoc.description}, ' ')
      ELSE 
        null
    END`,
    })
    .from(attachments)
    .leftJoin(embeddingDoc, eq(attachments.id, embeddingDoc.attachmentsId))
    .where(
      and(
        inArray(attachments.id, ids),
        eq(attachments.createdBy, userId),
        eq(attachments.isForRAG, true),
        inArray(
          attachments.fileType,
          supportedDocumentTypes as SupportedDocumentTypes[],
        ),
      ),
    )
    .groupBy(attachments.id);

  return att
    .filter((a) => supportedDocumentTypes.includes(a.fileType))
    .map((a) => ({ ...a, fileType: a.fileType as SupportedDocumentTypes }));
}

export async function nameToNewChat(
  userId: string,
  chatId: string,
  newName: string,
) {
  await userCache(userId);

  await db
    .update(chats)
    .set({
      name: newName,
    })
    .where(and(eq(chats.id, chatId), eq(chats.createdBy, userId)));
}
export async function updateEmail(userId: string, email: string) {
  await userCache(userId);

  await db
    .update(accounts)
    .set({
      email,
    })
    .where(eq(accounts.id, userId));
}
