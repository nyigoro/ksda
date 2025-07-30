import { apiRoutes } from '../utils/apiRoutes';
import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import SongList from '../components/SongList';
import SongCardSkeleton from '../components/SongCardSkeleton';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
  lyrics: string;
}

const SONGS_PER_PAGE = 9; // Number of songs to load per page

const apiCache = new Map(); // Simple cache for API responses

const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const fetchSongs = useCallback(async (currentOffset: number, append: boolean = false) => {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(SONGS_PER_PAGE));
    queryParams.append('offset', String(currentOffset));
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }
    if (selectedLanguage) {
      queryParams.append('language', selectedLanguage);
    }
    if (selectedCategory) {
      queryParams.append('category', selectedCategory);
    }

    const cacheKey = `songs-${queryParams.toString()}`;

    if (apiCache.has(cacheKey)) {
      const cachedData: Song[] = apiCache.get(cacheKey) as Song[];
      if (append) {
        setSongs((prevSongs: Song[]) => [...prevSongs, ...cachedData]);
      } else {
        setSongs(cachedData);
      }
      setHasMore(cachedData.length === SONGS_PER_PAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = `${apiRoutes.songs}?${queryParams.toString()}`;
      console.log("Fetching from URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${String(response.status)}`);
      }
      const data: Song[] = await response.json();
      apiCache.set(cacheKey, data); // Store in cache
      
      if (append) {
        setSongs((prevSongs: Song[]) => [...prevSongs, ...data]);
      } else {
        setSongs(data);
      }

      setHasMore(data.length === SONGS_PER_PAGE);
    } catch (e: unknown) {
      let errorMessage = "An unknown error occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedLanguage, selectedCategory]); // Add dependencies

  useEffect(() => {
    setOffset(0); // Reset offset when filters change
    setSongs([]); // Clear songs when filters change
    setHasMore(true); // Assume more songs when filters change
    void fetchSongs(0); // Initial fetch with filters
  }, [fetchSongs, searchTerm, selectedLanguage, selectedCategory]); // Add dependencies

  const handleLoadMore = () => {
    const newOffset = offset + SONGS_PER_PAGE;
    setOffset(newOffset);
    void fetchSongs(newOffset, true);
  };

  // Filtered songs logic is now handled by the API call

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary dark:text-primary-light">Discover SDA Songs</h1>
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search by title or artist..."
          className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:ring-primary-light"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); }}
          aria-label="Search songs by title or artist"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-400" size={20} aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="language-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Filter by Language:</label>
          <select
            id="language-filter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            value={selectedLanguage}
            onChange={(e) => { setSelectedLanguage(e.target.value); }}
          >
            <option value="">All Languages</option>
            <option value="swahili">Swahili</option>
            <option value="english">English</option>
            <option value="kikuyu">Kikuyu</option>
            <option value="luo">Luo</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Filter by Category:</label>
          <select
            id="category-filter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); }}
          >
            <option value="">All Categories</option>
            <option value="praise">Praise & Worship</option>
            <option value="sabbath">Sabbath Songs</option>
            <option value="youth">Youth Songs</option>
          </select>
        </div>
      </div>

      {loading && offset === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {[...Array(SONGS_PER_PAGE)].map((_, index) => (
            <SongCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-error dark:text-error-light">Error: {error}</div>
      ) : songs.length === 0 ? (
        <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
          <p className="text-xl font-semibold mb-2">No songs found matching your criteria.</p>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <SongList songs={songs} />
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-secondary-dark dark:focus:ring-primary-light"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;