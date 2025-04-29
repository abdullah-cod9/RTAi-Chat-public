CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" "file_enum" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embedding_doc" DROP CONSTRAINT "embedding_doc_id_embedding_doc_id_fk";
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_created_by_accounts_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embedding_doc" ADD CONSTRAINT "embedding_doc_id_attachments_id_fk" FOREIGN KEY ("id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;