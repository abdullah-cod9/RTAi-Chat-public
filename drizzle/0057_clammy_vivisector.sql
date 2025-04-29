ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_name_unique";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_name" SET DEFAULT 'anonymous';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_name" SET NOT NULL;