import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Moon, Sun, Star, Edit, Music } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { useDarkMode } from './hooks/useDarkMode';

const Home = lazy(() => import('./pages/Home'));
const SongDetails = lazy(() => import('./pages/SongDetails'));
const AddSong = lazy(() => import('./pages/AddSong'));
const LyricsPage = lazy(() => import('./pages/LyricsPage'));
const LyricsLibrary = lazy(() => import('./pages/LyricsLibrary'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const SongManagement = lazy(() => import('./pages/SongManagement'));
const AudioLibrary = lazy(() => import('./pages/AudioLibrary'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <nav className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Kenyan SDA Songs
              </Link>
              <ul className="flex space-x-4 items-center">
                <li>
                  <Link 
                    to="/" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-song" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors" 
                    aria-label="Add a new song"
                  >
                    <PlusCircle className="mr-1" size={18} aria-hidden="true" /> Add Song
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/lyrics-library" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors" 
                    aria-label="View all lyrics"
                  >
                    <BookOpen className="mr-1" size={18} aria-hidden="true" /> Lyrics Library
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/favorites" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors" 
                    aria-label="View favorite songs"
                  >
                    <Star className="mr-1" size={18} aria-hidden="true" /> Favorites
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/manage-songs" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors" 
                    aria-label="Manage songs"
                  >
                    <Edit className="mr-1" size={18} aria-hidden="true" /> Manage Songs
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/audio-library" 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors" 
                    aria-label="View audio library"
                  >
                    <Music className="mr-1" size={18} aria-hidden="true" /> Audio Library
                  </Link>
                </li>
                <li>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
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
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading page...</p>
            </div>
          }>
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
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;