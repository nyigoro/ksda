import { apiRoutes } from '../utils/apiRoutes';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist?: string;
  youtube_link?: string;
  audio_link?: string;
  lyrics?: string;
  composer?: string;
  language?: string;
  region?: string;
  category?: string;
  tags?: string;
  duration?: number;
  is_featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const AddSong: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [audioLink, setAudioLink] = useState<string>('');
  const [lyrics, setLyrics] = useState<string>('');
  const [composer, setComposer] = useState<string>('');
  const [language, setLanguage] = useState<string>('swahili');
  const [region, setRegion] = useState<string>('');
  const [category, setCategory] = useState<string>('praise');
  const [tags, setTags] = useState<string>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('active');
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loadingSong, setLoadingSong] = useState<boolean>(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [youtubeLinkError, setYoutubeLinkError] = useState<string | null>(null);
  const [audioLinkError, setAudioLinkError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoadingSong(true);
      fetch(apiRoutes.song(id))
        .then(res => res.json())
        .then((data) => {
          const songData = data as Song;
          setTitle(songData.title || '');
          setArtist(songData.artist || '');
          setYoutubeLink(songData.youtube_link || '');
          setAudioLink(songData.audio_link || '');
          setLyrics(songData.lyrics || '');
          setComposer(songData.composer || '');
          setLanguage(songData.language || 'swahili');
          setRegion(songData.region || '');
          setCategory(songData.category || 'praise');
          setTags(songData.tags || ''); // data.tags is already a string
          setDuration(songData.duration || '');
          setIsFeatured(songData.is_featured || false);
          setStatus(songData.status || 'active');
          setLoadingSong(false);
        })
        .catch((e: unknown) => {
          console.error("Failed to fetch song for editing:", e);
          let errorMessage = "An unknown error occurred";
          if (e instanceof Error) {
            errorMessage = e.message;
          }
          setMessage({ type: 'error', text: `Failed to load song for editing: ${errorMessage}` });
          setLoadingSong(false);
        });
    }
  }, [id]);

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      isValid = false;
    } else {
      setTitleError(null);
    }

    if (youtubeLink && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.*$/.test(youtubeLink)) {
      setYoutubeLinkError('Please enter a valid YouTube link.');
      isValid = false;
    } else {
      setYoutubeLinkError(null);
    }

    if (audioLink && !/^https?:\/\/.*/.test(audioLink)) {
      setAudioLinkError('Please enter a valid audio link.');
      isValid = false;
    } else {
      setAudioLinkError(null);
    }

    if (duration !== '' && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      setDurationError('Duration must be a positive number.');
      isValid = false;
    } else {
      setDurationError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please correct the errors in the form.' });
      return;
    }

    const songData = {
      title: title || null,
      artist: artist || null,
      youtube_link: youtubeLink || '',
      audio_link: audioLink || '',
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
    const url = id ? apiRoutes.song(id) : apiRoutes.songs;

    try {
      const apiSecret = localStorage.getItem('api_secret');
      if (!apiSecret) {
        setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
        navigate('/login');
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiSecret}`,
        },
        body: JSON.stringify(songData),
      });

      const result: { error?: string, statusText?: string } = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Song ${id ? 'updated' : 'added'} successfully!` });
        if (!id) {
          setTitle('');
          setArtist('');
          setYoutubeLink('');
          setAudioLink('');
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
        navigate('/');
      } else {
        setMessage({ type: 'error', text: `Failed to ${id ? 'update' : 'add'} song: ${result.error || response.statusText}` });
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setMessage({ type: 'error', text: `Error: ${errorMessage}` });
    }
  };

  if (loadingSong) {
    return <div className="text-center py-8 text-info">Loading song for editing...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{id ? 'Edit Song' : 'Add New Song'}</h1>

      {message && (
        <div className={`p-3 mb-4 rounded-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Title *</label>
          <input type="text" id="title" value={title} onChange={(e) => { setTitle(e.target.value); }} className="input" />
          {titleError && <p className="text-sm text-red-500">{titleError}</p>}
        </div>

        <div>
          <label htmlFor="youtubeLink" className="block font-medium">YouTube Link</label>
          <input type="url" id="youtubeLink" value={youtubeLink} onChange={(e) => { setYoutubeLink(e.target.value); }} className="input" />
          {youtubeLinkError && <p className="text-sm text-red-500">{youtubeLinkError}</p>}
        </div>

        <div>
          <label htmlFor="audioLink" className="block font-medium">Audio Link</label>
          <input type="url" id="audioLink" value={audioLink} onChange={(e) => { setAudioLink(e.target.value); }} className="input" />
          {audioLinkError && <p className="text-sm text-red-500">{audioLinkError}</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block font-medium">Duration (seconds)</label>
          <input type="number" id="duration" value={duration} onChange={(e) => { setDuration(e.target.value === '' ? '' : Number(e.target.value)); }} className="input" />
          {durationError && <p className="text-sm text-red-500">{durationError}</p>}
        </div>

        {/* Add the rest of the fields (artist, composer, etc.) as you already had them */}

        <div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
            {id ? 'Update Song' : 'Add Song'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSong;
