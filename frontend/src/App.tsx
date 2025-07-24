import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Moon, Sun, Star, Edit, Music } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const SongDetails = lazy(() => import('./pages/SongDetails'));
const AddSong = lazy(() => import('./pages/AddSong'));
const LyricsPage = lazy(() => import('./pages/LyricsPage'));
const LyricsLibrary = lazy(() => import('./pages/LyricsLibrary'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const SongManagement = lazy(() => import('./pages/SongManagement'));
const AudioLibrary = lazy(() => import('./pages/AudioLibrary'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <nav className="bg-white shadow-sm dark:bg-neutral-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-2xl font-bold text-primary-500 dark:text-primary-400">Kenyan SDA Songs</Link>
              <ul className="flex space-x-4 items-center">
                <li>
                  <Link to="/" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-300 dark:hover:text-primary-400">Home</Link>
                </li>
                <li>
                  <Link to="/add-song" className="text-neutral-600 hover:text-primary-500 flex items-center dark:text-neutral-300 dark:hover:text-primary-400" aria-label="Add a new song">
                    <PlusCircle className="mr-1" size={18} aria-hidden="true" /> Add Song
                  </Link>
                </li>
                <li>
                  <Link to="/lyrics-library" className="text-neutral-600 hover:text-primary-500 flex items-center dark:text-neutral-300 dark:hover:text-primary-400" aria-label="View all lyrics">
                    <BookOpen className="mr-1" size={18} aria-hidden="true" /> Lyrics Library
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="text-neutral-600 hover:text-primary-500 flex items-center dark:text-neutral-300 dark:hover:text-primary-400" aria-label="View favorite songs">
                    <Star className="mr-1" size={18} aria-hidden="true" /> Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/manage-songs" className="text-neutral-600 hover:text-primary-500 flex items-center dark:text-neutral-300 dark:hover:text-primary-400" aria-label="Manage songs">
                    <Edit className="mr-1" size={18} aria-hidden="true" /> Manage Songs
                  </Link>
                </li>
                <li>
                  <Link to="/audio-library" className="text-neutral-600 hover:text-primary-500 flex items-center dark:text-neutral-400 dark:hover:text-primary-400" aria-label="View audio library">
                    <Music className="mr-1" size={18} aria-hidden="true" /> Audio Library
                  </Link>
                </li>
                <li>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="text-center py-8 text-info">Loading page...</div>}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/songs/:id" element={<SongDetails />} />
                <Route path="/add-song" element={<AddSong />} />
                <Route path="/add-song/:id" element={<AddSong />} />
                <Route path="/songs/:id/lyrics" element={<LyricsPage />} />
                <Route path="/lyrics-library" element={<LyricsLibrary />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/manage-songs" element={<SongManagement />} />
                <Route path="/audio-library" element={<AudioLibrary />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;

