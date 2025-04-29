CREATE INDEX "chat_id_idx" ON "messages" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "messages" USING btree ("user_id");