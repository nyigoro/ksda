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
    e.preventDefault(); // Prevent navigating to song details
    setShowVideo(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 dark:bg-neutral-800">
      <Link to={`/songs/${song.id}`} className="block">
        <h2 className="text-xl font-bold text-primary dark:text-primary-light">{song.title}</h2>
        <p className="text-gray-600 dark:text-neutral-400">{song.artist}</p>
        {youtubeId && (
          <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center">
            {!showVideo ? (
              <div className="relative w-full h-full cursor-pointer" onClick={handlePlayClick}>
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                  alt={`Thumbnail for ${song.title}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <PlayCircle size={64} className="text-white hover:text-primary transition-colors duration-200" />
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={`YouTube video player for ${song.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}
        <pre className="mt-4 text-sm bg-gray-100 p-2 rounded-sm whitespace-pre-wrap line-clamp-3 dark:bg-neutral-700 dark:text-neutral-300">{song.lyrics}</pre>
      </Link>
      <div className="mt-2 text-right">
        <Link to={`/songs/${song.id}`} className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors border border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600">
          Read More
        </Link>
      </div>
    </div>
  );
}

