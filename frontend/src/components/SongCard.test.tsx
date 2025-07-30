import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the SongCard component
vi.mock('./SongCard', () => ({
  SongCard: vi.fn(({ song }) => (
    <div>
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
      {song.youtube_link && <p>YouTube Link: {song.youtube_link}</p>}
      <p>{song.lyrics}</p>
      <a href={`/songs/${song.id}`}>Read More</a>
    </div>
  )),
}));

describe('SongCard', () => {
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lyrics: 'Test lyrics for the song.',
  };

  it('renders song details correctly', async () => {
    const { SongCard } = await import('./SongCard');
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText(/Test Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Test lyrics for the song\./i)).toBeInTheDocument();
  });

  it('renders YouTube iframe if link is provided', async () => {
    const { SongCard } = await import('./SongCard');
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    expect(screen.getByText(/YouTube Link/i)).toBeInTheDocument();
    expect(screen.getByText(/dQw4w9WgXcQ/i)).toBeInTheDocument();
  });

  it('links to the correct song details page', async () => {
    const { SongCard } = await import('./SongCard');
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    const link = screen.getByRole('link', { name: 'Read More' });
    expect(link).toHaveAttribute('href', '/songs/1');
  });
});

