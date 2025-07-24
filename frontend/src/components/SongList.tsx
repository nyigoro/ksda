import React from 'react';
import { Link } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_link: string;
  lyrics: string;
}

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  const extractYouTubeID = (link: string): string => {
    const match = link.match(/(?:youtu\.be\/|v=)([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="p-4 space-y-4">
      {songs.map(song => (
        <div key={song.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">
            <Link to={`/songs/${song.id}`} className="text-blue-600 hover:underline">
              {song.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-600">by {song.artist}</p>
          
          {song.youtube_link && (
            <div className="mt-2">
              <iframe
                width="100%"
                height="215"
                src={`https://www.youtube.com/embed/${extractYouTubeID(song.youtube_link)}`}
                title={song.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <p className="mt-2 text-gray-700">
            {song.lyrics.slice(0, 200)}...
          </p>
        </div>
      ))}
    </div>
  );
};

export default SongList;