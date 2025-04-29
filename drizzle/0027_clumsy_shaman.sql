CREATE TYPE "public"."models_enum" AS ENUM('gpt-4o', 'gpt-4o-mini', 'o3-mini');--> statement-breakpoint
CREATE TYPE "public"."subscription_enum" AS ENUM('free', 'plus', 'pro', 'enterprise');--> statement-breakpoint
CREATE TABLE "models_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model" "models_enum" NOT NULL,
	"price_output" numeric(10, 4) NOT NULL,
	"price_input" numeric(10, 4) NOT NULL,
	"full_price" numeric(10, 4) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"credits" numeric(10, 4) NOT NULL,
	"subscription_type" "subscription_enum" DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;