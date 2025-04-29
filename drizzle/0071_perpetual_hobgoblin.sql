DROP POLICY "Enable select for realtime" ON "chat_group" CASCADE;--> statement-breakpoint
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
CREATE POLICY "Enable select for users based on userId" ON "chat_group" AS RESTRICTIVE FOR SELECT TO "authenticated" USING (
        EXISTS (
          SELECT 1
          FROM chats
          WHERE chats.id = chat_group.chat_id
          AND chats.created_by = (SELECT auth.uid())
        )
      );