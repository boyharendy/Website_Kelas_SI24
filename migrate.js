import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './backend/db/schema.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  console.log('Connecting to local database...');
  const localClient = createClient({ url: 'file:backend/db/sqlite.db' });
  const localDb = drizzle(localClient, { schema });

  console.log('Connecting to Turso database...');
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });
  const tursoDb = drizzle(tursoClient, { schema });

  try {
    const localStudents = await localDb.select().from(schema.students);
    const localAchievements = await localDb.select().from(schema.achievements);
    const localGallery = await localDb.select().from(schema.gallery);
    const localGuestbook = await localDb.select().from(schema.guestbook);

    console.log(`Found ${localStudents.length} students, ${localAchievements.length} achievements, ${localGallery.length} gallery items locally.`);

    if (localStudents.length > 0) {
      await tursoDb.delete(schema.students);
      // SQLite limit for bulk inserts might be hit, we insert in chunks or just all if small
      if (localStudents.length > 50) {
          for (let i = 0; i < localStudents.length; i += 50) {
              await tursoDb.insert(schema.students).values(localStudents.slice(i, i + 50));
          }
      } else {
          await tursoDb.insert(schema.students).values(localStudents);
      }
    }

    if (localAchievements.length > 0) {
      await tursoDb.delete(schema.achievements);
      await tursoDb.insert(schema.achievements).values(localAchievements);
    }
    
    if (localGallery.length > 0) {
      await tursoDb.delete(schema.gallery);
      await tursoDb.insert(schema.gallery).values(localGallery);
    }

    if (localGuestbook.length > 0) {
      await tursoDb.delete(schema.guestbook);
      await tursoDb.insert(schema.guestbook).values(localGuestbook);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
