ALTER TABLE "accounts" ALTER COLUMN "public_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL;