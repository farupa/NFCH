import React, { useState, useEffect } from 'react';
import PostCard from '../components/postcard';
import './home.css';

const TABS = [
  { key: 'all',       label: '🌸 All Posts' },
  { key: 'complaint', label: '📢 Complaints' },
  { key: 'advice',    label: '💡 Advice' },
  { key: 'help',      label: '🤝 Seeking Help' },
];



function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace this with real API call:
    // fetch('/api/posts').then(r => r.json()).then(data => setPosts(data))
    fetch('/api/posts')
  .then(r => r.json())
  .then(data => {
    setPosts(data);
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'all'
    ? posts
    : posts.filter(p => p.type === activeTab);

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Welcome to NFCH Hall</h1>
        <p className="hero-sub">
          A safe space to share complaints, advice, and seek help from your fellow residents 🌸
        </p>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>Loading posts…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>🌷 No posts yet in this category. Be the first!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;