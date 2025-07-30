import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
}

const LyricsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`/api/songs/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${String(response.status)}`);
        }
        const data: Song = await response.json();
        setSong(data);
      } catch (e: unknown) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchSong();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-info" aria-live="polite">Loading lyrics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-error" aria-live="polite">Error: {error}</div>;
  }

  if (!song) {
    return <div className="text-center py-8" aria-live="polite">Song not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-primary dark:text-primary-light">{String(song.title)}</h1>
      <p className="text-center text-neutral-600 text-lg mb-6 dark:text-neutral-400">by {String(song.artist)}</p>
      
      <div className="bg-white p-8 rounded-lg shadow-lg typography dark:bg-neutral-800 dark:text-neutral-200">
        <pre className="whitespace-pre-wrap font-sans text-neutral-800 text-base leading-relaxed dark:text-neutral-200">{song.lyrics}</pre>
      </div>
    </div>
  );
};

export default LyricsPage;
