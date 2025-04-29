ALTER TABLE "group_chat" RENAME COLUMN "group_id" TO "chat_id";--> statement-breakpoint
ALTER TABLE "group_chat" DROP CONSTRAINT "group_chat_group_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "group_chat" ADD CONSTRAINT "group_chat_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;