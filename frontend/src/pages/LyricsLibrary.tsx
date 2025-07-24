import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
}

const LyricsLibrary: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/songs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSongs(data);
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

    fetchSongs();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-info">Loading lyrics library...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-error">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-primary dark:text-primary-light">Lyrics Library</h1>
        <Link to="/add-song" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-secondary-dark dark:focus:ring-primary-light">
          <PlusCircle className="-ml-1 mr-2" size={20} aria-hidden="true" /> Add New Lyrics
        </Link>
      </div>
      <div className="space-y-8">
        {songs.length === 0 ? (
          <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
            <p className="text-xl font-semibold mb-2">No lyrics available.</p>
            <p>Add some songs to build your lyrics library!</p>
          </div>
        ) : (
          songs.map(song => (
            <div key={song.id} className="bg-white p-8 rounded-lg shadow-lg dark:bg-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-secondary dark:text-secondary-light">{song.title}</h2>
                  <p className="text-neutral-600 text-lg dark:text-neutral-400">by {song.artist}</p>
                </div>
              </div>
              <div className="typography">
                <pre className="whitespace-pre-wrap font-sans text-neutral-800 text-base leading-relaxed dark:text-neutral-200">{song.lyrics}</pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LyricsLibrary;
