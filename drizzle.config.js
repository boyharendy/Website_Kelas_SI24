import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './backend/db/schema.js',
  out: './backend/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:backend/db/sqlite.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
