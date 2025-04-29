ALTER TABLE "public"."attachments" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."file_enum";--> statement-breakpoint
CREATE TYPE "public"."file_enum" AS ENUM('pdf', 'image', 'office');--> statement-breakpoint
ALTER TABLE "public"."attachments" ALTER COLUMN "type" SET DATA TYPE "public"."file_enum" USING "type"::"public"."file_enum";