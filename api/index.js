export default {
    async fetch(req, env) {
        const url = new URL(req.url);
        if (url.pathname === "/api/songs") {
            const result = await env.DB.prepare(`SELECT id, title, artist, youtube_link, lyrics FROM songs LIMIT 20`).all();
            return Response.json(result.results);
        }
        if (url.pathname.startsWith("/api/songs/")) {
            const id = url.pathname.split("/").pop();
            const result = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`).bind(id).first();
            return result
                ? Response.json(result)
                : new Response("Not Found", { status: 404 });
        }
        if (url.pathname === "/api/songs" && req.method === "POST") {
            try {
                const songData = await req.json();
                const { title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = songData;
                const stmt = env.DB.prepare(`INSERT INTO songs (title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                const result = await stmt.bind(title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status).run();
                return Response.json({ success: true, result }, { status: 201 });
            }
            catch (e) {
                let errorMessage = "An unknown error occurred";
                if (e instanceof Error) {
                    errorMessage = e.message;
                }
                return Response.json({ success: false, error: errorMessage }, { status: 400 });
            }
        }
        return new Response("Hello from Worker");
    },
};
