import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  nim: text('nim').notNull().unique(),
  name: text('name').notNull(),
  photo: text('photo'), // Stores base64 or URL
  quote: text('quote'),
  ig: text('ig'),
  gh: text('gh')
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  trophy: text('trophy').notNull(),
  title: text('title').notNull(),
  level: text('level'),
  members: text('members'),
  desc: text('desc')
});

export const gallery = sqliteTable('gallery', {
  id: text('id').primaryKey(),
  src: text('src').notNull(), // Stores base64 or URL
  caption: text('caption'),
  category: text('category').notNull()
});

export const guestbook = sqliteTable('guestbook', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull()
});
