import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './newpost.css';

const TYPES = [
  { key: 'complaint', label: '📢 Complaint',    desc: 'Report a problem in the hall' },
  { key: 'advice',    label: '💡 Advice',        desc: 'Share helpful tips with others' },
  { key: 'help',      label: '🤝 Seeking Help',  desc: 'Ask for support from residents' },
];

function NewPost() {
  const navigate = useNavigate();
  const [type, setType]       = useState('');
  const [text, setText]       = useState('');
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [user, setUser]       = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Not logged in → redirect to login
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

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
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('type', type);
      formData.append('text', text);
      if (image) formData.append('image', image);

      const res = await fetch('https://nfch-backend.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (res.status === 401) {
        // Token expired → redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to submit');

      navigate('/');

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking login
  if (!user) return null;

  return (
    <div className="new-post-wrap">
      <div className="new-post-card">
        <h2 className="np-title">🌸 Create a New Post</h2>
        <p className="np-sub">Share with your fellow hall residents</p>

        {/* Show logged in user info */}
        <div className="np-user-info">
          <span>🌸 {user.name}</span>
          <span>🏠 Room {user.roomNumber}</span>
          <span>💺 Seat {user.seatNumber}</span>
        </div>

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