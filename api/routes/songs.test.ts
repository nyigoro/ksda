import { describe, it, expect, vi } from 'vitest';
import songs from './songs';
import { Hono } from 'hono';
import { Env } from '../index';

describe('Songs API', () => {
  it('GET /songs should return a list of songs', async () => {
    const mockSongs = [{ id: '1', title: 'Test Song' }];
    const mockDb = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue({ results: mockSongs }),
    };

    const app = new Hono<{ Bindings: Env }>();
    app.route('/api', songs);

    const c = {
      env: {
        DB: mockDb,
      },
      req: new Request('http://localhost/api/songs'),
    };

    const res = await app.fetch(c.req, c.env);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockSongs);
  });
});
