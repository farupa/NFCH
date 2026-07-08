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
    photo:   '/images/placeholder.svg',
    
  },
  {
    post:    'Vice President',
    name:    'Alumni Name Here',
    job:     'Doctor',
    company: 'Dhaka Medical',
    batch:   '2017',
    session: '2017-18',
    dept:    'Physics',
    photo:   '/images/placeholder.svg',
    
  },
  {
    post:    'Secretary',
    name:    'Alumni Name Here',
    job:     'Teacher',
    company: 'BUET',
    batch:   '2019',
    session: '2019-20',
    dept:    'Mathematics',
    photo:   '/images/placeholder.svg',
    
  },
  {
    post:    'Treasurer',
    name:    'Alumni Name Here',
    job:     'Banker',
    company: 'Dutch Bangla Bank',
    batch:   '2018',
    session: '2018-19',
    dept:    'Economics',
    photo:   '/images/placeholder.svg',
    
  },
  {
    post:    'Member',
    name:    'Alumni Name Here',
    job:     'Engineer',
    company: 'Samsung',
    batch:   '2020',
    session: '2020-21',
    dept:    'EEE',
    photo:   '/images/placeholder.svg',
    
  },
  {
    post:    'Member',
    name:    'Alumni Name Here',
    job:     'Lawyer',
    company: 'Supreme Court',
    batch:   '2019',
    session: '2019-20',
    dept:    'Law',
    photo:   '/images/placeholder.svg',
    
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
  e.target.src = '/images/placeholder.svg';
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