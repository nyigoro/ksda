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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {songs.map(song => (
        <div key={song.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden dark:bg-neutral-800">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              <Link to={`/songs/${song.id}`} className="text-primary hover:text-secondary dark:text-primary-light dark:hover:text-secondary-light">
                {song.title}
              </Link>
            </h2>
            <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-400">by {song.artist}</p>
            
            {song.youtube_link && (
              <div className="mt-2 rounded-lg overflow-hidden aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(song.youtube_link)}`}
                  title={song.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <p className="mt-4 text-neutral-700 leading-relaxed line-clamp-3 dark:text-neutral-300">
              {song.lyrics ? `${song.lyrics.slice(0, 200)}...` : 'No lyrics available.'}
            </p>
            <div className="mt-4 text-right">
              <Link to={`/songs/${song.id}`} className="text-primary hover:underline font-medium dark:text-primary-light dark:hover:text-secondary-light">
                Read More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;