import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Home from './pages/Home';
import SongDetails from './pages/SongDetails';
import AddSong from './pages/AddSong';
import LyricsPage from './pages/LyricsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <nav className="bg-primary shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-white text-2xl font-bold">Kenyan SDA Songs</Link>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="text-white hover:text-secondary">Home</Link>
                </li>
                <li>
                  <Link to="/add-song" className="text-white hover:text-secondary flex items-center">
                    <PlusCircle className="mr-1" size={18} /> Add Song
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs/:id" element={<SongDetails />} />
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/songs/:id/lyrics" element={<LyricsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

