ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "embedding_doc" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "group" RENAME TO "chat_group";--> statement-breakpoint
ALTER TABLE "chat_group" DROP CONSTRAINT "group_chat_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_group" DROP CONSTRAINT "group_created_by_accounts_public_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_group" ADD CONSTRAINT "chat_group_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_group" ADD CONSTRAINT "chat_group_created_by_accounts_public_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("public_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Enable insert for users based on userId" ON "attachments" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = attachments.created_by);--> statement-breakpoint
CREATE POLICY "Enable update for users based on userId" ON "attachments" AS RESTRICTIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = attachments.created_by);--> statement-breakpoint
CREATE POLICY "Enable delete for users based on userId" ON "attachments" AS RESTRICTIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = attachments.created_by);--> statement-breakpoint
CREATE POLICY "Enable select for users based on userId" ON "attachments" AS RESTRICTIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = attachments.created_by);--> statement-breakpoint
CREATE POLICY "Enable insert for users based on userId" ON "chats" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = chats.created_by);--> statement-breakpoint
CREATE POLICY "Enable update for users based on userId" ON "chats" AS RESTRICTIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = chats.created_by);--> statement-breakpoint
CREATE POLICY "Enable delete for users based on userId" ON "chats" AS RESTRICTIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = chats.created_by);--> statement-breakpoint
CREATE POLICY "Enable select for users based on userId" ON "chats" AS RESTRICTIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = chats.created_by);--> statement-breakpoint
CREATE POLICY "Enable insert for users based on attachment ownership" ON "embedding_doc" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
          SELECT 1
          FROM attachments
          WHERE attachments.id = embedding_doc.attachments_id
          AND attachments.created_by = (SELECT auth.uid())
        )
      );--> statement-breakpoint
CREATE POLICY "Enable select for users based on attachment ownership" ON "embedding_doc" AS RESTRICTIVE FOR SELECT TO "authenticated" USING (
        EXISTS (
          SELECT 1
          FROM attachments
          WHERE attachments.id = embedding_doc.attachments_id
          AND attachments.created_by = (SELECT auth.uid())
        )
      );--> statement-breakpoint
CREATE POLICY "Enable insert for users based on userId" ON "messages" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = messages.user_id);--> statement-breakpoint
CREATE POLICY "Enable select for users based on userId" ON "messages" AS RESTRICTIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = messages.user_id);--> statement-breakpoint
CREATE POLICY "Enable delete for users based on userId" ON "messages" AS RESTRICTIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = messages.user_id);--> statement-breakpoint
CREATE POLICY "Enable insert for users matching userId" ON "subscribers" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK (subscribers.user_id = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable select for users matching userId" ON "subscribers" AS RESTRICTIVE FOR SELECT TO "authenticated" USING (subscribers.user_id = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable update for users matching userId" ON "subscribers" AS RESTRICTIVE FOR UPDATE TO "authenticated" USING (subscribers.user_id = (SELECT auth.uid())) WITH CHECK (subscribers.user_id = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "Enable delete for users matching userId" ON "subscribers" AS RESTRICTIVE FOR DELETE TO "authenticated" USING (subscribers.user_id = (SELECT auth.uid()));