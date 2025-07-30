import { apiRoutes } from '../utils/apiRoutes';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

type Song = {
  id: string;
  title: string;
  artist?: string;
  lyrics?: string;
  youtube_link?: string;
};

export function SongCard({ song }: { song: Song }) {
  const youtubeId = song.youtube_link?.split("v=")[1]?.substring(0, 11);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowVideo(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 dark:bg-neutral-800 dark:border dark:border-neutral-700">
      <Link to={apiRoutes.song(song.id)} className="block">
        <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
          {song.title}
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-300 text-sm mt-1">
          by {song.artist}
        </p>
        
        {youtubeId && (
          <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center">
            {!showVideo ? (
              <div className="relative w-full h-full cursor-pointer" onClick={handlePlayClick}>
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                  alt={`Thumbnail for ${song.title}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-opacity">
                  <PlayCircle size={64} className="text-white hover:text-primary-400 transition-colors duration-200" />
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={`YouTube video player for ${song.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}

        <pre className="mt-4 text-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 p-3 rounded-md whitespace-pre-wrap line-clamp-3 border border-neutral-200 dark:border-neutral-700">
          {song.lyrics || "No lyrics available."}
        </pre>
      </Link>

      <div className="mt-3 text-right">
        <Link 
          to={apiRoutes.song(song.id)} 
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors border border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 hover:border-primary-400 dark:hover:border-primary-500"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
