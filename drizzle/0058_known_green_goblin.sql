ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "avatar_url" SET DEFAULT 'https://api.rtai.chat/storage/v1/object/public/Public_assets/images/ai-platform-svgrepo-com.png';--> statement-breakpoint
ALTER TABLE "subscribers" ALTER COLUMN "credits" SET DEFAULT '0.0500';--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;