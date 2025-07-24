import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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

    fetchSong();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading lyrics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-error">Error: {error}</div>;
  }

  if (!song) {
    return <div className="text-center py-8">Song not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-primary">{song.title}</h1>
      <p className="text-center text-gray-600 mb-6">by {song.artist}</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-secondary">Lyrics</h2>
        <pre className="whitespace-pre-wrap font-sans text-gray-800 text-base leading-relaxed">
          {song.lyrics}
        </pre>
      </div>

      <div className="text-center mt-8">
        <Link to={`/songs/${song.id}`} className="text-primary hover:underline">
          Back to Song Details
        </Link>
      </div>
    </div>
  );
};

export default LyricsPage;
