import React from 'react';
import './Alumni.css';

const COMMITTEE = [
  {
    post:    'President',
    name:    'Alumni Name Here',
    job:     'Software Engineer',
    company: 'Google',
    batch:   '2018',
    session: '2018-19',
    dept:    'CSE',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '👑'
  },
  {
    post:    'Vice President',
    name:    'Alumni Name Here',
    job:     'Doctor',
    company: 'Dhaka Medical',
    batch:   '2017',
    session: '2017-18',
    dept:    'Physics',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '🌟'
  },
  {
    post:    'Secretary',
    name:    'Alumni Name Here',
    job:     'Teacher',
    company: 'BUET',
    batch:   '2019',
    session: '2019-20',
    dept:    'Mathematics',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '📋'
  },
  {
    post:    'Treasurer',
    name:    'Alumni Name Here',
    job:     'Banker',
    company: 'Dutch Bangla Bank',
    batch:   '2018',
    session: '2018-19',
    dept:    'Economics',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '💰'
  },
  {
    post:    'Member',
    name:    'Alumni Name Here',
    job:     'Engineer',
    company: 'Samsung',
    batch:   '2020',
    session: '2020-21',
    dept:    'EEE',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '🌸'
  },
  {
    post:    'Member',
    name:    'Alumni Name Here',
    job:     'Lawyer',
    company: 'Supreme Court',
    batch:   '2019',
    session: '2019-20',
    dept:    'Law',
    photo:   'https://via.placeholder.com/150x150?text=Photo',
    icon:    '🌸'
  },
];

function Alumni() {
  return (
    <div className="alumni-wrap">
      <div className="alumni-hero">
        <h1 className="alumni-title">🎓 Alumni Committee</h1>
        <p className="alumni-sub">NFCH Hall Alumni Association — প্রাক্তন শিক্ষার্থী পরিষদ</p>
      </div>

      <div className="alumni-grid">
        {COMMITTEE.map((member, index) => (
          <div key={index} className="alumni-card">
            <div className="alumni-photo-wrap">
              <img
  src={member.photo}
  alt={member.name}
  className="alumni-photo"
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/120x160?text=Photo';
  }}
/>
              <span className="alumni-badge">{member.post}</span>
            </div>
            <div className="alumni-info">
              <h2 className="alumni-name">{member.name}</h2>
              <p className="alumni-job">💼 {member.job}</p>
              <p className="alumni-company">🏢 {member.company}</p>
              <div className="alumni-tags">
                <span className="alumni-tag">📚 {member.dept}</span>
                <span className="alumni-tag">🎓 {member.batch}</span>
                <span className="alumni-tag">📅 {member.session}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default Alumni;