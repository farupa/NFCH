import React, { useState, useEffect } from 'react';
import './Canteen.css';

const RATINGS = [
  { key: 'good',     label: '😋 Good',     color: '#2e7d32', bg: '#e8f5e9' },
  { key: 'moderate', label: '😐 Moderate',  color: '#f57f17', bg: '#fffde7' },
  { key: 'bad',      label: '😞 Bad',       color: '#e65100', bg: '#fff3e0' },
  { key: 'worst',    label: '🤢 Worst',     color: '#b71c1c', bg: '#ffebee' },
];

function Canteen() {
  const [posts, setPosts]       = useState([]);
  const [itemName, setItemName] = useState('');
  const [rating, setRating]     = useState('');
  const [comment, setComment]   = useState('');
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res  = await fetch('https://nfch-backend.onrender.com/api/canteen');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError('Please login first!');
    if (!itemName.trim()) return setError('Please enter item name');
    if (!rating) return setError('Please select a rating');

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      formData.append('rating',   rating);
      formData.append('comment',  comment);
      if (image) formData.append('image', image);

      const res = await fetch('https://nfch-backend.onrender.com/api/canteen', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body:    formData,
      });

      if (!res.ok) throw new Error('Failed');

      setItemName('');
      setRating('');
      setComment('');
      setImage(null);
      setPreview(null);
      fetchPosts();

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="canteen-wrap">
      <div className="canteen-hero">
        <h1 className="canteen-title">🍽️ Canteen Feedback</h1>
        <p className="canteen-sub">Share your canteen experience with fellow residents</p>
      </div>

      {/* Submit Form */}
      {token ? (
        <div className="canteen-form-card">
          <h3 className="canteen-form-title">📝 Add Your Feedback</h3>
          <form onSubmit={handleSubmit} className="canteen-form">

            <label className="c-label">Food Item Name</label>
            <input
              className="c-input"
              type="text"
              placeholder="e.g. Rice, Chicken curry, Dal..."
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              required
            />

            <label className="c-label">Your Rating</label>
            <div className="rating-grid">
              {RATINGS.map(r => (
                <button
                  type="button"
                  key={r.key}
                  className={`rating-btn ${rating === r.key ? 'selected' : ''}`}
                  style={rating === r.key ? { background: r.bg, color: r.color, borderColor: r.color } : {}}
                  onClick={() => setRating(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <label className="c-label">Comment / Complaint (optional)</label>
            <textarea
              className="c-textarea"
              placeholder="Write your feedback here..."
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

            <label className="c-label">Upload Photo (optional)</label>
            <label className="c-upload">
              {preview ? (
                <img src={preview} alt="preview" className="c-preview" />
              ) : (
                <div className="c-upload-placeholder">
                  <span>📷 Click to upload photo</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            </label>

            {error && <p className="c-error">⚠️ {error}</p>}

            <button type="submit" className="c-submit" disabled={loading}>
              {loading ? 'Submitting...' : '🌸 Submit Feedback'}
            </button>
          </form>
        </div>
      ) : (
        <div className="canteen-login-notice">
          <p>🌸 Please <a href="/login">login</a> to submit canteen feedback</p>
        </div>
      )}

      {/* Posts */}
      <h2 className="canteen-posts-title">Recent Feedback</h2>
      <div className="canteen-posts">
        {posts.length === 0 ? (
          <p className="canteen-empty">No feedback yet. Be the first! 🌸</p>
        ) : (
          posts.map(post => {
            const ratingCfg = RATINGS.find(r => r.key === post.rating) || RATINGS[0];
            return (
              <div key={post._id} className="canteen-post-card">
                <div className="canteen-post-header">
                  <div>
                    <h3 className="canteen-item-name">🍽️ {post.itemName}</h3>
                    <span
                      className="canteen-rating"
                      style={{ background: ratingCfg.bg, color: ratingCfg.color }}
                    >
                      {ratingCfg.label}
                    </span>
                  </div>
                  <span className="canteen-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>

                {post.imageData && (
                  <div className="canteen-img-wrap">
                    <img src={post.imageData} alt="food" className="canteen-img" />
                  </div>
                )}

                {post.comment && <p className="canteen-comment">{post.comment}</p>}

                <div className="canteen-footer">
                  <span>🌸 {post.author}</span>
                  <span>🏠 Room {post.roomNumber}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Canteen;