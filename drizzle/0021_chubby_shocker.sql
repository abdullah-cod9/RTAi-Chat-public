ALTER TABLE "messages_replies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "messages_replies" CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "parent_message_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_message_id_messages_id_fk" FOREIGN KEY ("parent_message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;