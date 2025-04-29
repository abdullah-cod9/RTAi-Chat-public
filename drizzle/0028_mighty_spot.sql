ALTER TABLE "public"."group" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."group_chat_role";--> statement-breakpoint
CREATE TYPE "public"."group_chat_role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "public"."group" ALTER COLUMN "role" SET DATA TYPE "public"."group_chat_role" USING "role"::"public"."group_chat_role";