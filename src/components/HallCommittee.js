import React from 'react';
import './HallCommittee.css';

const COMMITTEE = [
  {
    post:  'সভাপতি (President)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '👑'
  },
  {
    post:  'সহ-সভাপতি (Vice President)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '🌟'
  },
  {
    post:  'সাধারণ সম্পাদক (GS)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '📋'
  },
  {
    post:  'সহ-সাধারণ সম্পাদক (AGS)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '📝'
  },
  {
    post:  'কোষাধ্যক্ষ (Treasurer)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '💰'
  },
  {
    post:  'সদস্য (Member)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '🌸'
  },
  {
    post:  'সদস্য (Member)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '🌸'
  },
  {
    post:  'সদস্য (Member)',
    name:  'আপনার নাম লিখুন',
    dept:  'আপনার বিভাগ',
    batch: '২০২১',
    photo: 'https://via.placeholder.com/150x150?text=Photo',
    icon:  '🌸'
  },
];

function HallCommittee() {
  return (
    <div className="hc-wrap">
      <div className="hc-hero">
        <h1 className="hc-title">নওয়াব ফয়জুন্নেসা চৌধুরানী হল সংসদ</h1>
        <p className="hc-sub">হল সংসদের পরিচিতি ও সদস্য তালিকা</p>
      </div>

      <div className="hc-grid">
        {COMMITTEE.map((member, index) => (
          <div key={index} className="hc-card">
            <div className="hc-photo-wrap">
              <img
  src={member.photo}
  alt={member.name}
  className="hc-photo"
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/120x160?text=Photo';
  }}
/>
              <span className="hc-icon">{member.icon}</span>
            </div>
            <div className="hc-info">
              <h3 className="hc-post">{member.post}</h3>
              <h2 className="hc-name">{member.name}</h2>
              <p className="hc-detail">📚 {member.dept}</p>
              <p className="hc-detail">🎓 ব্যাচ: {member.batch}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default HallCommittee;