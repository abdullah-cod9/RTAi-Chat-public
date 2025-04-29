ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "subscribers" ALTER COLUMN "credits" SET DEFAULT '0.0500';--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER POLICY "Enable insert for users based on userId" ON "accounts" TO authenticated WITH CHECK ((select auth.uid()) = accounts.id and (auth.jwt()->>'is_anonymous')::boolean = true);--> statement-breakpoint
ALTER POLICY "Enable update for users based on userId" ON "accounts" TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = accounts.id and (auth.jwt()->>'is_anonymous')::boolean = false);--> statement-breakpoint
ALTER POLICY "Enable delete for users based on userId" ON "accounts" TO authenticated USING ((select auth.uid()) = accounts.id and (auth.jwt()->>'is_anonymous')::boolean = false);--> statement-breakpoint
ALTER POLICY "Enable select for users based on userId" ON "accounts" TO authenticated USING ((select auth.uid()) = accounts.id and (auth.jwt()->>'is_anonymous')::boolean = true);--> statement-breakpoint
ALTER POLICY "Enable insert for users based on userId" ON "attachments" TO authenticated WITH CHECK ((select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false);--> statement-breakpoint
ALTER POLICY "Enable update for users based on userId" ON "attachments" TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false);--> statement-breakpoint
ALTER POLICY "Enable delete for users based on userId" ON "attachments" TO authenticated USING ((select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false);--> statement-breakpoint
ALTER POLICY "Enable select for users based on userId" ON "attachments" TO authenticated USING ((select auth.uid()) = attachments.created_by and (select (auth.jwt()->>'is_anonymous')::boolean) is false);--> statement-breakpoint
ALTER POLICY "Enable insert for users based on attachment ownership" ON "embedding_doc" TO authenticated WITH CHECK (
          EXISTS (
            SELECT 1
            FROM attachments
            WHERE attachments.id = embedding_doc.attachments_id
            AND attachments.created_by = (SELECT auth.uid())
          )
        );--> statement-breakpoint
ALTER POLICY "Enable select for users based on attachment ownership" ON "embedding_doc" TO authenticated USING (
          EXISTS (
            SELECT 1
            FROM attachments
            WHERE attachments.id = embedding_doc.attachments_id
            AND attachments.created_by = (SELECT auth.uid())
          )
        );--> statement-breakpoint
ALTER POLICY "Enable insert for users based on userId" ON "chat_group" TO authenticated WITH CHECK (
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "Enable update for users based on userId" ON "chat_group" TO authenticated WITH CHECK (
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "Enable delete for users based on userId" ON "chat_group" TO authenticated USING (
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "Enable select for users based on userId" ON "chat_group" TO authenticated USING (
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      );