ALTER TABLE "chat_group" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable insert for users based on userId" ON "chat_group" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK (
      EXISTS (
        SELECT 1
        FROM chats
        WHERE chats.id = chat_group.chat_id
        AND chats.created_by = (SELECT auth.uid())
      )
    );--> statement-breakpoint
CREATE POLICY "Enable update for users based on userId" ON "chat_group" AS RESTRICTIVE FOR UPDATE TO "authenticated" WITH CHECK (
      EXISTS (
        SELECT 1
        FROM chats
        WHERE chats.id = chat_group.chat_id
        AND chats.created_by = (SELECT auth.uid())
      )
    );--> statement-breakpoint
CREATE POLICY "Enable delete for users based on userId" ON "chat_group" AS RESTRICTIVE FOR DELETE TO "authenticated" USING (
      EXISTS (
        SELECT 1
        FROM chats
        WHERE chats.id = chat_group.chat_id
        AND chats.created_by = (SELECT auth.uid())
      )
    );--> statement-breakpoint
CREATE POLICY "Enable select for users based on userId" ON "chat_group" AS RESTRICTIVE FOR SELECT TO "authenticated" USING (
      EXISTS (
        SELECT 1
        FROM chats
        WHERE chats.id = chat_group.chat_id
        AND chats.created_by = (SELECT auth.uid())
      )
    );--> statement-breakpoint
ALTER POLICY "Enable update for users based on userId" ON "chat_folders" TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = chat_folders.added_by);--> statement-breakpoint
ALTER POLICY "Enable update for users based on userId" ON "chats" TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = chats.created_by);