import { apiRoutes } from '../utils/apiRoutes';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
  lyrics: string;
}

const SongManagement: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiRoutes.songs);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Song[] = await response.json();
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

  useEffect(() => {
    void fetchSongs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }
    try {
            const response = await fetch(apiRoutes.song(id), {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Song deleted successfully!' });
        void fetchSongs(); // Re-fetch songs after deletion
      } else {
        const result: { error?: string; statusText?: string } = await response.json();
        setMessage({ type: 'error', text: `Failed to delete song: ${result.error || response.statusText}` });
      }
    } catch (e: unknown) {
      let errorMessage = "An unexpected error occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setMessage({ type: 'error', text: `Error: ${errorMessage}` });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-info">Loading songs for management...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-error">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary dark:text-primary-light">Manage Songs</h1>
      {message && (
        <div className={`p-3 mb-4 rounded-sm text-center ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'} dark:text-neutral-100 dark:bg-neutral-700`}>
          {message.text}
        </div>
      )}
      {songs.length === 0 ? (
        <div className="text-center py-8 text-neutral-600 dark:text-neutral-100">
          <p className="text-xl font-semibold mb-2">No songs to manage.</p>
          <p>Add new songs to see them here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-neutral-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-neutral-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Artist</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id} className="border-b border-gray-200 dark:border-neutral-700 last:border-b-0">
                  <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{song.title}</td>
                  <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">{song.artist}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link to={`/add-song/${song.id}`} className="text-primary hover:text-secondary dark:text-primary-light dark:hover:text-secondary-light" aria-label={`Edit ${song.title}`}>
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={() => { void handleDelete(song.id); }}
                      className="text-error hover:text-red-700 dark:text-error-light dark:hover:text-red-400"
                      aria-label={`Delete ${song.title}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SongManagement;
