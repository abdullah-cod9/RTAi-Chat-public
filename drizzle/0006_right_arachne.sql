CREATE TYPE "public"."file_enum" AS ENUM('pdf', 'image');--> statement-breakpoint
CREATE TABLE "embedding_doc" (
	"id" uuid PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embedding_doc" ADD CONSTRAINT "embedding_doc_id_embedding_doc_id_fk" FOREIGN KEY ("id") REFERENCES "public"."embedding_doc"("id") ON DELETE cascade ON UPDATE no action;