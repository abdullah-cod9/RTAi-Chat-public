ALTER TABLE "messages" ALTER COLUMN "content" SET DATA TYPE json USING content::json;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "parts" json NOT NULL;