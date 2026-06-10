import { db } from './db/index.js';
import { students, achievements, gallery, guestbook } from './db/schema.js';

import { studentsData as originalStudents } from '../src/data/studentsData.js';
import { achievementsData as originalAchievements } from '../src/data/achievementsData.js';
import { galleryData as originalGallery } from '../src/data/galleryData.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map original data to schema structure
const fallbackStudents = originalStudents.map(s => ({
  id: s.nim, // Using NIM as ID
  nim: s.nim,
  name: s.name,
  photo: s.photo || null,
  quote: s.quote || null,
  ig: s.ig || null,
  gh: s.gh || null
}));

const fallbackAchievements = originalAchievements.map((a, index) => ({
  id: a.id || `ach_${index}`,
  trophy: a.trophy || '🏆',
  title: a.title,
  level: a.level || null,
  members: a.members || null,
  desc: a.desc || null
}));

const fallbackGallery = originalGallery.map((g, index) => ({
  id: g.id || `gal_${index}`,
  src: g.src,
  caption: g.caption || null,
  category: g.category || 'semua'
}));

const fallbackGuestbook = [
  {
    id: "gb1",
    name: "Dosen Wali",
    message: "Semangat terus kelas SI 2024! Kompak selalu ya.",
    timestamp: new Date().toISOString()
  }
];

async function seed() {
  console.log("Seeding database...");
  
  try {
    await db.delete(students);
    await db.insert(students).values(fallbackStudents);
    console.log("Students seeded.");

    await db.delete(achievements);
    await db.insert(achievements).values(fallbackAchievements);
    console.log("Achievements seeded.");

    await db.delete(gallery);
    await db.insert(gallery).values(fallbackGallery);
    console.log("Gallery seeded.");

    await db.delete(guestbook);
    await db.insert(guestbook).values(fallbackGuestbook);
    console.log("Guestbook seeded.");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
