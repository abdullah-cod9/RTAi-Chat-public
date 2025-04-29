ALTER TABLE "chat_group" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Enable insert for users based on userId" ON "chat_group" CASCADE;--> statement-breakpoint
DROP POLICY "Enable update for users based on userId" ON "chat_group" CASCADE;--> statement-breakpoint
DROP POLICY "Enable delete for users based on userId" ON "chat_group" CASCADE;--> statement-breakpoint
DROP POLICY "Enable select for users based on userId" ON "chat_group" CASCADE;