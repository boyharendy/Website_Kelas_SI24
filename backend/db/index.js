import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';
import dotenv from 'dotenv';

// Load environment variables locally
dotenv.config();

// Create LibSQL client
// If TURSO_DATABASE_URL is not set, it will fallback to local file "sqlite.db"
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:backend/db/sqlite.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create Drizzle database instance
export const db = drizzle(client, { schema });
