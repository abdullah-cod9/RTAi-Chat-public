import { Parts } from "@/lib/myTypes";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
  AnyPgColumn,
  boolean,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
const authSchema = pgSchema("auth");
import {
  accountsPolicy,
  attachmentsPolicy,
  chatFoldersPolicy,
  chatsPolicy,
  embeddingDocPolicy,
  folderPolicy,
  groupPolicy,
  messagesPolicy,
  subscribersPolicy,
} from "./policys";
import {FeaturesPlan, free_plan } from "@/subscription";

export const message_role = pgEnum("messages_role", [
  "system",
  "user",
  "assistant",
]);
export const group_chat_role = pgEnum("group_chat_role", ["admin", "user"]);
export const chatTypeEnum = pgEnum("chat_type", ["private", "public"]);
export const modelsEnum = pgEnum("models_enum", [
  "gpt-4o",
  "gpt-4o-mini",
  "o3-mini",
]);
export const FileEnum = pgEnum("file_enum", [
  "pdf",
  "docx",
  "pptx",
  "xlsx",
  "txt",
  "gif",
  "jpeg",
  "png",
  "webp",
  "jpg",
]);
export const SubscriptionEnum = pgEnum("subscription_enum", [
  "free",
  "plus",
  "pro",
  "enterprise",
]);
export type DrizzleAccounts = typeof accounts.$inferSelect;
export const authUid = sql`(select auth.uid())`;
const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    publicId: uuid("public_id").defaultRandom().unique().notNull(),
    username: text("user_name").default("anonymous").notNull(),
    email: text("email").unique(),
    avatarUrl: text("avatar_url")
      .notNull()
      .default(
        "https://api.rtai.chat/storage/v1/object/public/Public_assets/images/ai-platform-svgrepo-com.png",
      ),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSignInAt: timestamp("last_sign_in_at", {
      mode: "string",
      withTimezone: true,
    }),
  },
  () => [...accountsPolicy],
);
export const folder = pgTable(
  "folder",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: uuid("created_by")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
  },
  () => [...folderPolicy],
);
export const chatFolders = pgTable(
  "chat_folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    folderId: uuid("folder_id")
      .references(() => folder.id, { onDelete: "cascade" })
      .notNull(),
    addedBy: uuid("added_by")
      .references(() => accounts.id, { onDelete: "cascade" }) // من أضاف المحادثة
      .notNull(),
    addedAt: timestamp("added_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [...chatFoldersPolicy],
);

export type DrizzleChat = typeof chats.$inferSelect;
export const chats = pgTable(
  "chats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: uuid("created_by")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    type: chatTypeEnum("type").notNull().default("private"),
  },
  () => [...chatsPolicy],
);

export const group = pgTable(
  "chat_group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid("created_by")
      .references(() => accounts.publicId, { onDelete: "cascade" })
      .notNull(),
    role: group_chat_role("role").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [...groupPolicy],
);

export type DrizzleMessages = typeof messages.$inferSelect;
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    parentMessageId: uuid("parent_message_id").references(
      (): AnyPgColumn => messages.id,
      { onDelete: "set null" },
    ),
    parts: jsonb("parts").$type<Parts[]>().notNull(),
    model: text("model"),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    role: message_role("role").notNull(),
  },
  (tab) => [
    index("chat_id_idx").on(tab.chatId),
    index("user_id_idx").on(tab.userId),
    ...messagesPolicy,
  ],
);
export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    messageId: uuid("message_id").references(() => messages.id, {
      onDelete: "cascade",
    }),
    chatId: uuid("chat_id").references(() => chats.id, {
      onDelete: "cascade",
    }),
    createdBy: uuid("created_by")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    fileName: text("file_name").notNull(),
    filePath: text("file_path").notNull(),
    fileSize: integer("file_size").notNull(),
    fileType: FileEnum("file_type").notNull(),
    isForRAG: boolean("is_for_rag").default(false),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [...attachmentsPolicy],
);

export type DrizzleEmbeddingDoc = typeof embeddingDoc.$inferSelect;
export const embeddingDoc = pgTable(
  "embedding_doc",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    attachmentsId: uuid("attachments_id")
      .references(() => attachments.id, { onDelete: "cascade" })
      .notNull(),
    description: text("description").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("attachments_id_idx").on(table.attachmentsId),
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    ...embeddingDocPolicy,
  ],
);

export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    subscriptionId: text("subscription_id").unique(),
    featuresPlan: jsonb("features_Plan").$type<FeaturesPlan>().default(free_plan).notNull(),
    credits: numeric("credits", { precision: 12, scale: 8 })
      .default("0.0500")
      .notNull(),
    subscriptionType: SubscriptionEnum("subscription_type")
      .default("free")
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    nextBillingDate: timestamp("next_billing_date", {
      mode: "string",
      withTimezone: true,
    }).notNull(),
  },
  () => [...subscribersPolicy],
);
