import React, { useEffect, useState } from 'react';
import SongList from '../components/SongList';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
  lyrics: string;
}

const FavoritesPage: React.FC = () => {
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteSongs(storedFavorites);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-info">Loading favorites...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary dark:text-primary-light">My Favorite Songs</h1>
      {favoriteSongs.length === 0 ? (
        <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
          <p className="text-xl font-semibold mb-2">No favorite songs yet.</p>
          <p>Add songs to your favorites from their details page!</p>
        </div>
      ) : (
        <SongList songs={favoriteSongs} />
      )}
    </div>
  );
};

export default FavoritesPage;
