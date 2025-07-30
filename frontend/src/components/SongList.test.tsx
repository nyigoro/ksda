import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SongList from './SongList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SongList', () => {
  const mockSongs = [
    {
      id: '1',
      title: 'Test Song 1',
      artist: 'Test Artist 1',
      youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      lyrics: 'Lyrics for test song 1.',
    },
    {
      id: '2',
      title: 'Test Song 2',
      artist: 'Test Artist 2',
      youtube_link: 'https://www.youtube.com/watch?v=anotherid',
      lyrics: 'Lyrics for test song 2.',
    },
  ];

  it('renders a list of songs', () => {
    render(
      <Router>
        <SongList songs={mockSongs} />
      </Router>
    );

    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText(/by Test Artist 1/i)).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    expect(screen.getByText(/by Test Artist 2/i)).toBeInTheDocument();
  });

  it('renders YouTube iframes for songs with links', () => {
    render(
      <Router>
        <SongList songs={mockSongs} />
      </Router>
    );

    expect(screen.getByTitle('Test Song 1')).toBeInTheDocument();
    expect(screen.getByTitle('Test Song 2')).toBeInTheDocument();
    expect(screen.getByTitle('Test Song 1')).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(screen.getByTitle('Test Song 2')).toHaveAttribute('src', 'https://www.youtube.com/embed/anotherid');
  });

  it('links to the correct song details pages', () => {
    render(
      <Router>
        <SongList songs={mockSongs} />
      </Router>
    );

    const song1Link = screen.getByRole('link', { name: 'Test Song 1' });
    expect(song1Link).toHaveAttribute('href', '/songs/1');

    const song2Link = screen.getByRole('link', { name: 'Test Song 2' });
    expect(song2Link).toHaveAttribute('href', '/songs/2');
  });

  it('displays lyrics snippet', () => {
    render(
      <Router>
        <SongList songs={mockSongs} />
      </Router>
    );
    expect(screen.getByText(/Lyrics for test song 1\./i)).toBeInTheDocument();
    expect(screen.getByText(/Lyrics for test song 2\./i)).toBeInTheDocument();
  });

  it('displays "No lyrics available." if lyrics are missing', () => {
    const songsWithoutLyrics = [
      {
        id: '3',
        title: 'Song Without Lyrics',
        artist: 'Unknown Artist',
        youtube_link: 'https://www.youtube.com/watch?v=no_lyrics',
        lyrics: '',
      },
    ];
    render(
      <Router>
        <SongList songs={songsWithoutLyrics} />
      </Router>
    );
    expect(screen.getByText('No lyrics available.')).toBeInTheDocument();
  });
});
