ALTER TYPE "public"."file_enum" ADD VALUE 'jpg';--> statement-breakpoint
ALTER TABLE "embedding_doc" ALTER COLUMN "embedding" SET NOT NULL;