ALTER TABLE "subscribers" ADD COLUMN "subscription_id" text;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_subscription_id_unique" UNIQUE("subscription_id");