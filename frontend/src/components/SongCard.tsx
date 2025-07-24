import { Link } from 'react-router-dom';

type Song = {
  id: string;
  title: string;
  artist?: string;
  lyrics?: string;
  youtube_link?: string;
};

export function SongCard({ song }: { song: Song }) {
  const youtubeId = song.youtube_link?.split("v=")[1]?.substring(0, 11);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300">
      <Link to={`/songs/${song.id}`} className="block">
        <h2 className="text-xl font-bold text-primary">{song.title}</h2>
        <p className="text-gray-600">{song.artist}</p>
        {youtubeId && (
          <iframe
            className="w-full mt-2 rounded-md"
            height="250"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <pre className="mt-2 text-sm bg-gray-100 p-2 rounded-sm whitespace-pre-wrap">{song.lyrics}</pre>
      </Link>
    </div>
  );
}
