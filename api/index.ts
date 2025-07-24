// Cloudflare Worker (api/index.ts)
export interface Env {
  DB: D1Database;
}

interface SongData {
  title: string;
  artist?: string;
  youtube_link?: string;
  lyrics?: string;
  composer?: string;
  language?: string;
  region?: string;
  category?: string;
  tags?: string;
  duration?: number;
  is_featured?: boolean;
  status?: string;
}

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    console.log("Worker received request for:", url.pathname);

    if (url.pathname === "/api/songs" && req.method === "POST") {
      try {
        const songData: SongData = await req.json();
        const { title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = songData;

        const stmt = env.DB.prepare(
          `INSERT INTO songs (title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        const result = await stmt.bind(
          title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status
        ).run();

        return Response.json({ success: true, result }, { status: 201 });
      } catch (e: unknown) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }

    if (url.pathname.startsWith("/api/songs/") && req.method === "PUT") {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) {
          return new Response("Song ID missing", { status: 400 });
        }
        const songData: SongData = await req.json();
        const { title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = songData;

        const stmt = env.DB.prepare(
          `UPDATE songs SET title = ?, artist = ?, youtube_link = ?, lyrics = ?, composer = ?, language = ?, region = ?, category = ?, tags = ?, duration = ?, is_featured = ?, status = ? WHERE id = ?`
        );

        const result = await stmt.bind(
          title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status, id
        ).run();

        if (result.changes === 0) {
          return new Response("Song not found or no changes made", { status: 404 });
        }

        return Response.json({ success: true, result }, { status: 200 });
      } catch (e: unknown) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }

    if (url.pathname.startsWith("/api/songs/") && req.method === "DELETE") {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) {
          return new Response("Song ID missing", { status: 400 });
        }

        const stmt = env.DB.prepare(`DELETE FROM songs WHERE id = ?`);
        const result = await stmt.bind(id).run();

        if (result.changes === 0) {
          return new Response("Song not found", { status: 404 });
        }

        return Response.json({ success: true, message: "Song deleted successfully" }, { status: 200 });
      } catch (e: unknown) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }

    if (url.pathname === "/api/songs" && req.method === "GET") {
      try {
        const { searchParams } = url;
        const search = searchParams.get('search');
        const language = searchParams.get('language');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        let query = 'SELECT * FROM songs';
        const conditions = [];
        const bindings = [];

        if (search) {
          conditions.push(`(title LIKE ? OR artist LIKE ?)`);
          bindings.push(`%${search}%`, `%${search}%`);
        }
        if (language) {
          conditions.push('language = ?');
          bindings.push(language);
        }
        if (category) {
          conditions.push('category = ?');
          bindings.push(category);
        }

        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ' ORDER BY title LIMIT ? OFFSET ?';
        bindings.push(limit, offset);

        const stmt = env.DB.prepare(query).bind(...bindings);
        const { results } = await stmt.all();
        
        return Response.json(results);

      } catch (e: unknown) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 500 });
      }
    }

    if (url.pathname.startsWith("/api/songs/")) {
      const id = url.pathname.split("/").pop();
      const result = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`).bind(id).first();
      return result
        ? Response.json(result)
        : new Response("Not Found", { status: 404 });
    }

    return new Response("Hello from Worker");
  },
};