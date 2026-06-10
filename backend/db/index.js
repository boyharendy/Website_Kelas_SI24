import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

let client;
export let dbError = null;
export let db = null;

try {
  client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:backend/db/sqlite.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  db = drizzle(client, { schema });
} catch (error) {
  dbError = error.message || String(error);
  console.error("FAILED TO CREATE LIBSQL CLIENT:", error);
}
