import { Hono } from 'hono';
import { cors } from 'hono/cors';
import songs from './routes/songs';



export type Env = {
  DB: D1Database;
  API_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware to allow frontend to call the API
app.use('/*', cors());

// Global error handler
app.onError((err, c) => {
  console.error(`API Error: ${c.req.method} ${c.req.url} - ${err.message}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.route('/api', songs);

app.post('/api/login', async (c) => {
  const { username, password } = await c.req.json();

  // In a real application, you would verify these credentials against a database
  if (username === 'admin' && password === c.env.API_SECRET) {
    return c.json({ token: c.env.API_SECRET });
  } else {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
});

export default {
    fetch: app.fetch,
};