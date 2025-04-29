import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

// const restrictAnonymous = sql`(auth.jwt()->>'is_anonymous')::boolean = false`;
// const allowAnonymous = sql`(auth.jwt()->>'is_anonymous')::boolean = true`;

export const accountsPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = accounts.id `,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = id`,
    withCheck: sql`(select auth.uid()) = accounts.id `,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = accounts.id `,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = accounts.id `,
  }),
];
export const folderPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = folder.created_by`,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = id`,
    withCheck: sql`(select auth.uid()) = folder.created_by`,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = folder.created_by`,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = folder.created_by`,
  }),
];
export const chatFoldersPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = chat_folders.added_by`,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = chat_folders.added_by`,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = chat_folders.added_by`,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = chat_folders.added_by`,
  }),
];
export const chatsPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = chats.created_by`,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = chats.created_by`,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = chats.created_by`,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = chats.created_by`,
  }),
];
export const groupPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      `,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      `,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      `,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      `,
  }),
];
export const messagesPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = messages.user_id`,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = messages.user_id`,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = messages.user_id`,
  }),
];
export const attachmentsPolicy = [
  pgPolicy("Enable insert for users based on userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`(select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false`,
  }),
  pgPolicy("Enable update for users based on userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = id`,
    withCheck: sql`(select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false`,
  }),
  pgPolicy("Enable delete for users based on userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false`,
  }),
  pgPolicy("Enable select for users based on userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`(select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false`,
  }),
];
export const embeddingDocPolicy = [
  pgPolicy("Enable insert for users based on attachment ownership", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`
          EXISTS (
            SELECT 1
            FROM attachments
            WHERE attachments.id = embedding_doc.attachments_id
            AND attachments.created_by = (SELECT auth.uid())
          )
        `,
  }),

  pgPolicy("Enable select for users based on attachment ownership", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`
          EXISTS (
            SELECT 1
            FROM attachments
            WHERE attachments.id = embedding_doc.attachments_id
            AND attachments.created_by = (SELECT auth.uid())
          )
        `,
  }),
];
export const subscribersPolicy = [
  pgPolicy("Enable insert for users matching userId", {
    for: "insert",
    to: authenticatedRole,
    as: `restrictive`,
    withCheck: sql`subscribers.user_id = (SELECT auth.uid())`,
  }),

  pgPolicy("Enable select for users matching userId", {
    for: "select",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`subscribers.user_id = (SELECT auth.uid())`,
  }),

  pgPolicy("Enable update for users matching userId", {
    for: "update",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`subscribers.user_id = (SELECT auth.uid())`,
    withCheck: sql`subscribers.user_id = (SELECT auth.uid())`,
  }),

  pgPolicy("Enable delete for users matching userId", {
    for: "delete",
    to: authenticatedRole,
    as: `restrictive`,
    using: sql`subscribers.user_id = (SELECT auth.uid())`,
  }),
];
