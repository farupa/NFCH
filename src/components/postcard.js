import React from 'react';
import './postcard.css';

const typeConfig = {
  complaint: { label: '📢 Complaint', color: '#e53935', bg: '#ffebee' },
  advice:    { label: '💡 Advice',    color: '#e91e8c', bg: '#fce4ec' },
  help:      { label: '🤝 Seeking Help', color: '#8e24aa', bg: '#f3e5f5' },
};

function PostCard({ post }) {
  const cfg = typeConfig[post.type] || typeConfig.help;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="post-card">
      <div className="post-card-header">
        <span
          className="post-tag"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
        <span className="post-date">{date}</span>
      </div>

      {post.imageUrl && (
        <div className="post-image-wrap">
          <img src={post.imageUrl} alt="post" className="post-image" />
        </div>
      )}

      <p className="post-text">{post.text}</p>

      <div className="post-footer">
        <span className="post-author">
          🌸 {post.author}
        </span>
        {post.roomNumber && (
          <span className="post-room">
            🏠 Room {post.roomNumber} · Seat {post.seatNumber}
          </span>
        )}
      </div>
    </div>
  );
}

export default PostCard;