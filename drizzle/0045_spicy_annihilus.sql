ALTER TABLE "models_pricing" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "models_pricing" CASCADE;--> statement-breakpoint
ALTER TABLE "subscribers" ALTER COLUMN "credits" SET DATA TYPE numeric(12, 8);