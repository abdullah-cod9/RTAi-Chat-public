CREATE TABLE "messages_replies" (
	"created_by" uuid NOT NULL,
	"original_message_id" uuid NOT NULL,
	"reply_to_message_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages_replies" ADD CONSTRAINT "messages_replies_created_by_accounts_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_replies" ADD CONSTRAINT "messages_replies_original_message_id_messages_id_fk" FOREIGN KEY ("original_message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_replies" ADD CONSTRAINT "messages_replies_reply_to_message_id_messages_id_fk" FOREIGN KEY ("reply_to_message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;