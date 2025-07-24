// src/components/SongCard.tsx

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
    <div className="p-4 border rounded shadow-md my-2">
      <h2 className="text-xl font-bold">{song.title}</h2>
      <p className="text-sm text-gray-500">{song.artist}</p>
      {youtubeId && (
        <iframe
          className="w-full mt-2"
          height="250"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      <pre className="mt-2 text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">{song.lyrics}</pre>
    </div>
  );
}
