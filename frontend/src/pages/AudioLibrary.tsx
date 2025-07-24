import React, { useEffect, useState } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
}

const AudioLibrary: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const extractYouTubeID = (link: string): string => {
    const match = link.match(/(?:youtu\.be\/|v=)([^&]+)/);
    return match ? match[1] : '';
  };

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
    return <div className="text-center py-8 text-info">Loading audio library...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-error">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary dark:text-primary-light">Audio Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.length === 0 ? (
          <div className="col-span-full text-center py-8 text-neutral-600 dark:text-neutral-400">
            <p className="text-xl font-semibold mb-2">No audio available yet.</p>
            <p>Add songs with YouTube links to build your audio library!</p>
          </div>
        ) : (
          songs.map(song => song.youtube_link && (
            <div key={song.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-neutral-800">
              <h2 className="text-2xl font-bold mb-2 text-secondary dark:text-secondary-light">{song.title}</h2>
              <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-400">by {song.artist}</p>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(song.youtube_link)}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=0`}
                  title={`YouTube audio player for ${song.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioLibrary;
