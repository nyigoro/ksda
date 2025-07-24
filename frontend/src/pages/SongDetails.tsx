// src/pages/SongDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import SongList from '../components/SongList'; // Assuming SongList can display a subset of songs

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
  lyrics: string;
}

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); // New state for like functionality
  const [isFavorite, setIsFavorite] = useState(false); // New state for favorite functionality
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]); // New state for related songs

  useEffect(() => {
    fetch(`/songs/${id}`)
      .then(res => res.json())
      .then(data => {
        setSong(data);
        setLoading(false);
        // Simulate fetching like status from backend
        setIsLiked(localStorage.getItem(`liked-song-${id}`) === 'true');
        // Check if song is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some((favSong: Song) => favSong.id === data.id));
      });

    // Simulate fetching related songs
    // In a real app, you'd make an API call like `/songs/${id}/related`
    // For now, let's just return some dummy data or a subset of existing songs
    fetch('/songs') // Fetch all songs for simulation
      .then(res => res.json())
      .then(allSongs => {
        const filteredRelated = allSongs.filter((s: Song) => s.id !== id).slice(0, 3); // Get 3 random related songs
        setRelatedSongs(filteredRelated);
      });

  }, [id]);

  const handleLikeToggle = () => {
    setIsLiked(prevIsLiked => {
      const newIsLiked = !prevIsLiked;
      // Simulate API call to update like status
      // In a real app, you'd send a POST/PUT request to your backend
      console.log(`Song ${song?.title} ${newIsLiked ? 'liked' : 'unliked'}`);
      localStorage.setItem(`liked-song-${id}`, String(newIsLiked));
      return newIsLiked;
    });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(prevIsFavorite => {
      const newIsFavorite = !prevIsFavorite;
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (newIsFavorite) {
        if (song && !favorites.some((favSong: Song) => favSong.id === song.id)) {
          favorites.push(song);
        }
      } else {
        favorites = favorites.filter((favSong: Song) => favSong.id !== song?.id);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return newIsFavorite;
    });
  };

  if (loading) return <p className="p-4 text-info">Loading...</p>;
  if (!song) return <p className="p-4 text-error">Song not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg dark:bg-neutral-800">
      <h1 className="text-4xl font-extrabold mb-2 text-primary dark:text-primary-light">{song.title}</h1>
      <p className="text-neutral-600 text-lg mb-4 dark:text-neutral-400">by {song.artist}</p>

      {song.youtube_link && (
        <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${extractYouTubeID(song.youtube_link)}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=0`}
            title={`YouTube video player for ${song.title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-8">
        <Link to={`/songs/${song.id}/lyrics`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-secondary-dark dark:focus:ring-primary-light" aria-label={`View full lyrics for ${song.title}`}>
          View Full Lyrics
        </Link>
        <button
          onClick={handleLikeToggle}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${isLiked ? 'text-red-500 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900 dark:hover:bg-red-800' : 'text-gray-500 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400`}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
        >
          <Heart className="mr-2" size={20} fill={isLiked ? 'currentColor' : 'none'} />
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button
          onClick={handleFavoriteToggle}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${isFavorite ? 'text-yellow-500 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-400 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'text-gray-500 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-yellow-400`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className="mr-2" size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
      </div>

      {relatedSongs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-primary dark:text-primary-light text-center">Related Songs</h2>
          <SongList songs={relatedSongs} />
        </div>
      )}
    </div>
  );
}

function extractYouTubeID(link: string): string {
  const match = link.match(/(?:youtu\.be\/|v=)([^&]+)/);
  return match ? match[1] : '';
}
