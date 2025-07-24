import { render, screen } from '@testing-library/react';
import { SongCard } from './SongCard';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SongCard', () => {
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lyrics: 'Test lyrics for the song.',
  };

  it('renders song details correctly', () => {
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText(/by Test Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Test lyrics for the song\./i)).toBeInTheDocument();
  });

  it('renders YouTube iframe if link is provided', () => {
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('links to the correct song details page', () => {
    render(
      <Router>
        <SongCard song={mockSong} />
      </Router>
    );

    const link = screen.getByRole('link', { name: 'Test Song' });
    expect(link).toHaveAttribute('href', '/songs/1');
  });
});
