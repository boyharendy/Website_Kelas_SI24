import express from 'express';
import cors from 'cors';
import { db } from '../backend/db/index.js';
import { students, achievements, gallery, guestbook } from '../backend/db/schema.js';
import { eq } from 'drizzle-orm';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// --- STUDENTS ---
app.get('/api/students', async (req, res) => {
  try {
    const data = await db.select().from(students);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const data = req.body;
    await db.insert(students).values(data);
    res.json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/students/:nim', async (req, res) => {
  try {
    const { nim } = req.params;
    const data = req.body;
    await db.update(students).set(data).where(eq(students.nim, nim));
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:nim', async (req, res) => {
  try {
    const { nim } = req.params;
    await db.delete(students).where(eq(students.nim, nim));
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACHIEVEMENTS ---
app.get('/api/achievements', async (req, res) => {
  try {
    const data = await db.select().from(achievements);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      await db.delete(achievements);
      if (data.length > 0) {
        await db.insert(achievements).values(data);
      }
    } else {
      await db.insert(achievements).values(data);
    }
    res.json({ message: 'Achievements updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.update(achievements).set(data).where(eq(achievements.id, id));
    res.json({ message: 'Achievement updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(achievements).where(eq(achievements.id, id));
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GALLERY ---
app.get('/api/gallery', async (req, res) => {
  try {
    const data = await db.select().from(gallery);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      await db.delete(gallery);
      if (data.length > 0) {
        await db.insert(gallery).values(data);
      }
    } else {
      await db.insert(gallery).values(data);
    }
    res.json({ message: 'Gallery updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.update(gallery).set(data).where(eq(gallery.id, id));
    res.json({ message: 'Gallery item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(gallery).where(eq(gallery.id, id));
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GUESTBOOK ---
app.get('/api/guestbook', async (req, res) => {
  try {
    const data = await db.select().from(guestbook);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const data = req.body;
    await db.insert(guestbook).values(data);
    res.json({ message: 'Guestbook entry added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/guestbook/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(guestbook).where(eq(guestbook.id, id));
    res.json({ message: 'Guestbook entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export app for Vercel Serverless Function
export default app;
