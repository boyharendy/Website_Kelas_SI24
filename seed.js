import { db } from './backend/db/index.js';
import { students, achievements } from './backend/db/schema.js';
import { studentsData } from './src/data/studentsData.js';
import { achievementsData } from './src/data/achievementsData.js';

async function seed() {
  try {
    console.log('Seeding students...');
    const formattedStudents = studentsData.map(s => ({
      id: s.nim,
      nim: s.nim,
      name: s.name,
      photo: null,
      quote: s.quote,
      ig: s.ig,
      gh: s.gh
    }));
    await db.insert(students).values(formattedStudents);
    console.log('Seeding achievements...');
    await db.insert(achievements).values(achievementsData);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed:', error);
    process.exit(1);
  }
}

seed();
