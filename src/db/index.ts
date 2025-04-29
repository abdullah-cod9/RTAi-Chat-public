import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as fs from 'fs'

config({ path: '.env' });
if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

const sql = postgres(process.env.DATABASE_URL!,{ prepare: false, ssl: {
  rejectUnauthorized: true,
  ca: fs.readFileSync('src/lib/supabase/certificates/prod-ca-2021.crt').toString()
} });

export const db = drizzle(sql);
