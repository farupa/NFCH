import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newpost.css';

const TYPES = [
  { key: 'complaint', label: '📢 Complaint',    desc: 'Report a problem in the hall' },
  { key: 'advice',    label: '💡 Advice',        desc: 'Share helpful tips with others' },
  { key: 'help',      label: '🤝 Seeking Help',  desc: 'Ask for support from residents' },
];

function NewPost() {
  const navigate = useNavigate();
  const [type, setType]         = useState('');
  const [text, setText]         = useState('');
  const [author, setAuthor]     = useState('');
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!type)        return setError('Please choose a post type.');
    if (!text.trim()) return setError('Please write something.');

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('type',   type);
      formData.append('text',   text);
      formData.append('author', author || 'Anonymous');
      if (image) formData.append('image', image);

      // TODO: replace URL with your real backend URL
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit');

      navigate('/');
   } catch (err) {
  console.error(err);
  setError('Something went wrong. Please try again.');
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-wrap">
      <div className="new-post-card">
        <h2 className="np-title">🌸 Create a New Post</h2>
        <p className="np-sub">Share with your fellow hall residents</p>

        <form onSubmit={handleSubmit} className="np-form">

          {/* Post Type */}
          <label className="np-label">What kind of post is this?</label>
          <div className="type-grid">
            {TYPES.map(t => (
              <button
                type="button"
                key={t.key}
                className={`type-card ${type === t.key ? 'selected' : ''}`}
                onClick={() => setType(t.key)}
              >
                <span className="type-label">{t.label}</span>
                <span className="type-desc">{t.desc}</span>
              </button>
            ))}
          </div>

          {/* Name */}
          <label className="np-label" htmlFor="author">Your Name (optional)</label>
          <input
            id="author"
            type="text"
            className="np-input"
            placeholder="Anonymous"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />

          {/* Text */}
          <label className="np-label" htmlFor="text">Your Message</label>
          <textarea
            id="text"
            className="np-textarea"
            placeholder="Write your complaint, advice or request here…"
            rows={5}
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />

          {/* Image upload */}
          <label className="np-label">Attach a Photo (optional)</label>
          <label className="upload-zone">
            {preview ? (
              <img src={preview} alt="preview" className="upload-preview" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>Click to upload a photo</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>

          {error && <p className="np-error">⚠️ {error}</p>}

          <button type="submit" className="np-submit" disabled={loading}>
            {loading ? 'Posting…' : '🌸 Submit Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPost;