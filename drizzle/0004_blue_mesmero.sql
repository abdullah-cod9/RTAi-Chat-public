ALTER TABLE "messages_replies" RENAME COLUMN "message_id" TO "original_message_id";--> statement-breakpoint
ALTER TABLE "messages_replies" RENAME COLUMN "reply_content_to_id" TO "reply_to_message_id";--> statement-breakpoint
ALTER TABLE "messages_replies" DROP CONSTRAINT "messages_replies_message_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "messages_replies" DROP CONSTRAINT "messages_replies_user_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "messages_replies" DROP CONSTRAINT "messages_replies_reply_content_to_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "messages_replies" ADD CONSTRAINT "messages_replies_original_message_id_messages_id_fk" FOREIGN KEY ("original_message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_replies" ADD CONSTRAINT "messages_replies_reply_to_message_id_messages_id_fk" FOREIGN KEY ("reply_to_message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_replies" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "messages_replies" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "messages_replies" DROP COLUMN "reply_content";