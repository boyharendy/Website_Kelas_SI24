import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './backend/db/schema.js',
  out: './backend/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './backend/db/sqlite.db',
  },
});
