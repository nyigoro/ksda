// src/App.tsx
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SongDetails from './pages/SongDetails';

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">Kenyan SDA Songs</Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs/:id" element={<SongDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

