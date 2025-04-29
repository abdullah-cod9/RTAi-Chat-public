ALTER TABLE "group_chat" DROP CONSTRAINT "group_chat_created_by_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "group_chat" ADD CONSTRAINT "group_chat_created_by_accounts_public_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("public_id") ON DELETE cascade ON UPDATE no action;