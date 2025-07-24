import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSong: React.FC = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [composer, setComposer] = useState('');
  const [language, setLanguage] = useState('swahili');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('praise');
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState<number | '' >('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('active');
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const songData = {
      title,
      artist,
      youtube_link: youtubeLink,
      lyrics,
      composer,
      language,
      region,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      duration: duration === '' ? undefined : Number(duration),
      is_featured: isFeatured,
      status,
    };

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Song added successfully!' });
        // Clear form
        setTitle('');
        setArtist('');
        setYoutubeLink('');
        setLyrics('');
        setComposer('');
        setLanguage('swahili');
        setRegion('');
        setCategory('praise');
        setTags('');
        setDuration('');
        setIsFeatured(false);
        setStatus('active');
        navigate('/'); // Navigate back to home after successful submission
      } else {
        setMessage({ type: 'error', text: `Failed to add song: ${result.error || response.statusText}` });
      }
    } catch (e: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setMessage({ type: 'error', text: `Error: ${errorMessage}` });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Add New Song</h1>
      {message && (
        <div className={`p-3 mb-4 rounded text-center ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title <span className="text-error">*</span></label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="title" type="text" placeholder="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artist">Artist</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="artist" type="text" placeholder="Artist Name" value={artist} onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="youtubeLink">YouTube Link</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="youtubeLink" type="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lyrics">Lyrics</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-32"
            id="lyrics" placeholder="Song lyrics..." value={lyrics} onChange={(e) => setLyrics(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="composer">Composer</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="composer" type="text" placeholder="Composer Name" value={composer} onChange={(e) => setComposer(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">Language</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="swahili">Swahili</option>
            <option value="english">English</option>
            <option value="kikuyu">Kikuyu</option>
            <option value="luo">Luo</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="region">Region</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="region" type="text" placeholder="e.g., Central, Nyanza" value={region} onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="category" value={category} onChange={(e) => setCategory(e.target.value)}
          >
            <option value="praise">Praise & Worship</option>
            <option value="sabbath">Sabbath Songs</option>
            <option value="youth">Youth Songs</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (comma-separated)</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="tags" type="text" placeholder="e.g., uplifting, traditional" value={tags} onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration (seconds)</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="duration" type="number" placeholder="e.g., 240" value={duration} onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label className="ml-2 block text-sm text-gray-900" htmlFor="isFeatured">Is Featured</label>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            id="status" value={status} onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            type="submit"
          >
            Add Song
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSong;
