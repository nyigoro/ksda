import { Hono } from 'hono';
import { Env } from '../index';
import { MiddlewareHandler } from 'hono';
import { songSchema } from '../validation';

// Auth middleware
const authMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.substring(7);
  if (token !== c.env.API_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};



interface Song {
  id: string;
  title: string;
  artist?: string;
  youtube_link?: string;
  audio_link?: string;
  lyrics?: string;
  composer?: string;
  language?: string;
  region?: string;
  category?: string;
  tags?: string;
  duration?: number;
  is_featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const songs = new Hono<{ Bindings: Env }>();

// GET /songs - list songs with pagination, search, filter
songs.get('/songs', async (c) => {
  try {
    const { limit = '9', offset = '0', search, language, category } = c.req.query();

    let query = 'SELECT * FROM songs';
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push('(title LIKE ? OR artist LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (language) {
      conditions.push('language = ?');
      params.push(language);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const { results } = await c.env.DB.prepare(query).bind(...params).all<Song>();
    return c.json(results || []);
  } catch (e: unknown) {
    console.error('Error fetching songs:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return c.json({ error: 'Failed to retrieve songs', details: errorMessage }, 500);
  }
});

// GET /song/:id - get a single song
songs.get('/song/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { results } = await c.env.DB.prepare('SELECT * FROM songs WHERE id = ?').bind(id).all<Song>();
    if (results.length === 0) {
      return c.json({ error: 'Song not found' }, 404);
    }
    return c.json(results[0]);
  } catch (e: unknown) {
    console.error(`Error fetching song ${c.req.param('id')}:`, e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return c.json({ error: 'Failed to retrieve song', details: errorMessage }, 500);
  }
});

// POST /songs - create a new song
songs.post('/songs', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const validation = songSchema.safeParse(body);

    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.flatten() }, 400);
    }

    const { title, artist, youtube_link, audio_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = validation.data;

    const id = crypto.randomUUID();
    const query = `
      INSERT INTO songs (id, title, artist, youtube_link, audio_link, lyrics, composer, language, region, category, tags, duration, is_featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await c.env.DB.prepare(query).bind(
      id, title, artist, youtube_link, audio_link, lyrics, composer, language,
      region, category, tags, duration, is_featured, status
    ).run();

    const newSong = await c.env.DB.prepare('SELECT * FROM songs WHERE id = ?').bind(id).first<Song>();

    return c.json(newSong, 201);
  } catch (e: unknown) {
    console.error('Error creating song:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return c.json({ error: 'Failed to create song', details: errorMessage }, 500);
  }
});

// PUT /song/:id - update a song
songs.put('/song/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();

    // Parse and validate JSON body
    const body = await c.req.json();
    const validation = songSchema.safeParse(body);

    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.flatten() }, 400);
    }

    const {
      title,
      artist,
      youtube_link,
      audio_link,
      lyrics,
      composer,
      language,
      region,
      category,
      tags,
      duration,
      is_featured,
      status
    } = validation.data;

    // Run update query
    const query = `
      UPDATE songs
      SET title = ?, artist = ?, youtube_link = ?, audio_link = ?, lyrics = ?, composer = ?, language = ?, region = ?, category = ?, tags = ?, duration = ?, is_featured = ?, status = ?
      WHERE id = ?
    `;

    const result = await c.env.DB.prepare(query).bind(
      title, artist, youtube_link, audio_link, lyrics, composer, language,
      region, category, tags, duration, is_featured, status, id
    ).run();

    // Check if update was successful
    if (result.success === false || result.changes === 0) {
      return c.json({ error: 'Update failed or song not found' }, 404);
    }

    // Return updated song
    const updatedSong = await c.env.DB.prepare('SELECT * FROM songs WHERE id = ?').bind(id).first<Song>();
    return c.json(updatedSong);
  } catch (e: unknown) {
    console.error(`Error updating song ${c.req.param('id')}:`, e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return c.json({ error: 'Failed to update song', details: errorMessage }, 500);
  }
});

// DELETE /song/:id - delete a song
songs.delete('/song/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    await c.env.DB.prepare('DELETE FROM songs WHERE id = ?').bind(id).run();
    return c.json({ message: 'Song deleted successfully' });
  } catch (e: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error(`Error deleting song ${c.req.param('id')}:`, errorMessage);
    return c.json({ error: 'Failed to delete song', details: errorMessage }, 500);
  }
});

export default songs;
