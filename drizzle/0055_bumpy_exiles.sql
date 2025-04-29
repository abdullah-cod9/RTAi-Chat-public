ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_user_id_unique";--> statement-breakpoint
ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_user_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;