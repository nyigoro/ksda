// src/pages/SongDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then(res => res.json())
      .then(data => {
        setSong(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!song) return <p className="p-4 text-red-600">Song not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
      <p className="text-gray-600 mb-4">by {song.artist}</p>

      {song.youtube_link && (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${extractYouTubeID(song.youtube_link)}`}
          title={song.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Lyrics</h2>
      <div className="bg-gray-100 p-4 rounded text-gray-800 max-h-60 overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{song.lyrics}</pre>
      </div>
      <div className="text-center mt-4">
        <Link to={`/songs/${song.id}/lyrics`} className="text-blue-600 hover:underline">
          View Full Lyrics
        </Link>
      </div>
    </div>
  );
}

function extractYouTubeID(link: string): string {
  const match = link.match(/(?:youtu\.be\/|v=)([^&]+)/);
  return match ? match[1] : '';
}
