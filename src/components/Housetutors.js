import React, { useState } from 'react';
import './Housetutors.css';

const TUTORS = [
  {
    name:   'ম্যাম নাম লিখুন',
    dept:   'বিভাগের নাম',
    mobile: '01XXXXXXXXX',
    floors: '১ম ও ২য় তলা',
    photo:  '/images/placeholder.svg',
  },
  {
    name:   'ম্যাম নাম লিখুন',
    dept:   'বিভাগের নাম',
    mobile: '01XXXXXXXXX',
    floors: '৩য় ও ৪র্থ তলা',
    photo:  '/images/placeholder.svg',
  },
  {
    name:   'ম্যাম নাম লিখুন',
    dept:   'বিভাগের নাম',
    mobile: '01XXXXXXXXX',
    floors: '৫ম ও ৬ষ্ঠ তলা',
    photo:  '/images/placeholder.svg',
  },
  {
    name:   'ম্যাম নাম লিখুন',
    dept:   'বিভাগের নাম',
    mobile: '01XXXXXXXXX',
    floors: '৭ম তলা',
    photo:  '/images/placeholder.svg',
  },
];

function HouseTutors() {
  const [messages, setMessages] = useState(
    TUTORS.map(() => '')
  );
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [statusIndex, setStatusIndex]   = useState(null);
  const [statusMsg, setStatusMsg]       = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (index, value) => {
    const updated = [...messages];
    updated[index] = value;
    setMessages(updated);
  };

  const handleSend = async (index) => {
    setStatusIndex(null);
    setStatusMsg('');

    if (!token) {
      setStatusIndex(index);
      setStatusMsg('⚠️ Please login first.');
      return;
    }
    if (!messages[index].trim()) {
      setStatusIndex(index);
      setStatusMsg('⚠️ Please write a message.');
      return;
    }

    setLoadingIndex(index);

    try {
      const res = await fetch('https://nfch-backend.onrender.com/api/tutor-messages', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorName: TUTORS[index].name,
          text:      messages[index]
        })
      });

      if (!res.ok) throw new Error('Failed');

      const updated = [...messages];
      updated[index] = '';
      setMessages(updated);

      setStatusIndex(index);
      setStatusMsg('✅ Message sent successfully.');
    } catch (err) {
      setStatusIndex(index);
      setStatusMsg('⚠️ Something went wrong. Try again.');
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="ht-wrap">
      <div className="ht-hero">
        <div className="ht-tag">NFCH Hall</div>
        <h1 className="ht-title">🏠 House Tutors</h1>
        <p className="ht-sub">হাউস টিউটর ম্যাডামদের পরিচিতি ও যোগাযোগ</p>
      </div>

      <div className="ht-grid">
        {TUTORS.map((tutor, index) => (
          <div key={index} className="ht-card">
            <div className="ht-card-top">
              <img
                src={tutor.photo}
                alt={tutor.name}
                className="ht-photo"
                onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
              />
            </div>

            <div className="ht-card-body">
              <h3 className="ht-name">{tutor.name}</h3>

              <div className="ht-detail-row">
                <span className="ht-icon">📚</span>
                <span>{tutor.dept}</span>
              </div>
              <div className="ht-detail-row">
                <span className="ht-icon">📞</span>
                <span>{tutor.mobile}</span>
              </div>
              <div className="ht-detail-row">
                <span className="ht-icon">🏢</span>
                <span>{tutor.floors}</span>
              </div>

              <label className="ht-msg-label">
                💌 Any message to house tutor mam?
              </label>
              <textarea
                className="ht-msg-textarea"
                rows={2}
                placeholder="Write your message here..."
                value={messages[index]}
                onChange={e => handleChange(index, e.target.value)}
              />

              {statusIndex === index && (
                <p className={`ht-status ${statusMsg.startsWith('✅') ? 'success' : 'error'}`}>
                  {statusMsg}
                </p>
              )}

              <button
                className="ht-send-btn"
                onClick={() => handleSend(index)}
                disabled={loadingIndex === index}
              >
                {loadingIndex === index ? 'Sending...' : '📩 Send Message'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseTutors;