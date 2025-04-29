DROP TABLE "chats" CASCADE;--> statement-breakpoint
DROP TABLE "chats_folder" CASCADE;--> statement-breakpoint
DROP TABLE "group_chat" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
DROP TYPE "public"."file_enum";--> statement-breakpoint
CREATE TYPE "public"."file_enum" AS ENUM('pdf', 'office');