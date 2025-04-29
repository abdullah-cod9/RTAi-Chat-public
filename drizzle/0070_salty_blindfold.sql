CREATE POLICY "Enable select for realtime" ON "chat_group" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      true
    );