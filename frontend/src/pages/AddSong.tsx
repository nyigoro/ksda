import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddSong: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const [loadingSong, setLoadingSong] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoadingSong(true);
      fetch(`/songs/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title || '');
          setArtist(data.artist || '');
          setYoutubeLink(data.youtube_link || '');
          setLyrics(data.lyrics || '');
          setComposer(data.composer || '');
          setLanguage(data.language || 'swahili');
          setRegion(data.region || '');
          setCategory(data.category || 'praise');
          setTags(data.tags ? data.tags.join(', ') : '');
          setDuration(data.duration || '');
          setIsFeatured(data.is_featured || false);
          setStatus(data.status || 'active');
          setLoadingSong(false);
        })
        .catch(err => {
          console.error("Failed to fetch song for editing:", err);
          setMessage({ type: 'error', text: 'Failed to load song for editing.' });
          setLoadingSong(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();
    console.log("Default prevented");
    setMessage(null);

    const songData = {
      title: title || null,
      artist: artist || null,
      youtube_link: youtubeLink || null,
      lyrics: lyrics || null,
      composer: composer || null,
      language: language || null,
      region: region || null,
      category: category || null,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').join(',') || null,
      duration: duration === '' ? null : Number(duration),
      is_featured: isFeatured,
      status: status || null,
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/songs/${id}` : '/songs';

    console.log("Submitting song data:", songData);
    console.log("Method:", method, "URL:", url);

    try {
      console.log("Attempting fetch...");
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songData),
      });
      console.log("Fetch response received.");

      const result = await response.json();
      console.log("Response JSON parsed:", result);

      if (response.ok) {
        setMessage({ type: 'success', text: `Song ${id ? 'updated' : 'added'} successfully!` });
        if (!id) {
          // Clear form only for new songs
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
        }
        navigate('/'); // Navigate back to home after successful submission
      } else {
        setMessage({ type: 'error', text: `Failed to ${id ? 'update' : 'add'} song: ${result.error || response.statusText}` });
      }
    } catch (e: unknown) {
      console.error("Fetch error:", e);
      let errorMessage = 'An unexpected error occurred.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setMessage({ type: 'error', text: `Error: ${errorMessage}` });
    }
  };

  if (loadingSong) {
    return <div className="text-center py-8 text-info">Loading song for editing...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary dark:text-primary-light">{id ? 'Edit Song' : 'Add New Song'}</h1>
      {message && (
        <div className={`p-3 mb-4 rounded-sm text-center ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'} dark:text-neutral-200 dark:bg-neutral-700`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-sm px-8 pt-6 pb-8 mb-4 dark:bg-neutral-800">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="title">Title <span className="text-error">*</span></label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="title" type="text" placeholder="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} required aria-describedby="title-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="artist">Artist</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="artist" type="text" placeholder="Artist Name" value={artist} onChange={(e) => setArtist(e.target.value)} aria-describedby="artist-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="youtubeLink">YouTube Link</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="youtubeLink" type="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} aria-describedby="youtubeLink-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="lyrics">Lyrics</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm h-32 dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="lyrics" placeholder="Song lyrics..." value={lyrics} onChange={(e) => setLyrics(e.target.value)} aria-describedby="lyrics-description"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="composer">Composer</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="composer" type="text" placeholder="Composer Name" value={composer} onChange={(e) => setComposer(e.target.value)} aria-describedby="composer-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="language">Language</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="language" value={language} onChange={(e) => setLanguage(e.target.value)} aria-describedby="language-description"
          >
            <option value="swahili">Swahili</option>
            <option value="english">English</option>
            <option value="kikuyu">Kikuyu</option>
            <option value="luo">Luo</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="region">Region</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="region" type="text" placeholder="e.g., Central, Nyanza" value={region} onChange={(e) => setRegion(e.target.value)} aria-describedby="region-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="category">Category</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="category" value={category} onChange={(e) => setCategory(e.target.value)} aria-describedby="category-description"
          >
            <option value="praise">Praise & Worship</option>
            <option value="sabbath">Sabbath Songs</option>
            <option value="youth">Youth Songs</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="tags">Tags (comma-separated)</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="tags" type="text" placeholder="e.g., uplifting, traditional" value={tags} onChange={(e) => setTags(e.target.value)} aria-describedby="tags-description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="duration">Duration (seconds)</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="duration" type="number" placeholder="e.g., 240" value={duration} onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))} aria-describedby="duration-description"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary dark:bg-neutral-700 dark:border-neutral-600 dark:focus:ring-primary-light"
            id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} aria-describedby="isFeatured-description"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-neutral-300" htmlFor="isFeatured">Is Featured</label>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="status">Status</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="status" value={status} onChange={(e) => setStatus(e.target.value)} aria-describedby="status-description"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-primary-dark focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-dark dark:hover:bg-secondary-dark dark:focus:ring-primary-light"
            type="submit"
          >
            {id ? 'Update Song' : 'Add Song'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSong;
