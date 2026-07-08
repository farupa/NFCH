import React, { useState } from 'react';
import './Office.css';

const OFFICER = {
  name:  'জনাব আনোয়ার হোসেন',
  post:  'হল অফিসার (Hall Officer)',
  photo: '/images/placeholder.svg',
  icon:  '👨‍💼'
};

const ASSISTANTS = [
  {
    name:  'নুরজাহান হাসি',
    post:  'অফিস সহকারী (Office Assistant)',
    photo: '/images/placeholder.svg',
    icon:  '👩‍💼'
  },
  {
    name:  'রাকা চৌধুরী',
    post:  'অফিস সহকারী (Office Assistant)',
    photo: '/images/placeholder.svg',
    icon:  '👩‍💼'
  },
];

function Office() {
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) return setError('Please login first to submit a complaint.');
    if (!complaint.trim()) return setError('Please write your complaint.');

    setLoading(true);
    try {
      const res = await fetch('https://nfch-backend.onrender.com/api/office-complaints', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: complaint })
      });

      if (!res.ok) throw new Error('Failed');

      setComplaint('');
      setSuccess('✅ Your complaint has been submitted to the office.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="office-wrap">
      <div className="office-hero">
        <div className="office-tag">NFCH Hall Office</div>
        <h1 className="office-title">🏢 হল অফিস</h1>
        <p className="office-sub">হল প্রশাসনিক কর্মকর্তা ও কর্মচারীদের পরিচিতি</p>
      </div>

      {/* Hall Officer */}
      <h2 className="office-section-title">👔 হল অফিসার</h2>
      <div className="office-officer-card">
        <div className="office-photo-wrap">
          <img
            src={OFFICER.photo}
            alt={OFFICER.name}
            className="office-photo large"
            onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
          />
        </div>
        <div className="office-officer-info">
          <h3 className="office-name">{OFFICER.name}</h3>
          <p className="office-post">{OFFICER.post}</p>
        </div>
      </div>

      {/* Office Assistants */}
      <h2 className="office-section-title">🧑‍💼 অফিস সহকারীবৃন্দ</h2>
      <div className="office-grid">
        {ASSISTANTS.map((person, i) => (
          <div key={i} className="office-card">
            <div className="office-photo-wrap">
              <img
                src={person.photo}
                alt={person.name}
                className="office-photo"
                onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
              />
            </div>
            <h3 className="office-name">{person.name}</h3>
            <p className="office-post">{person.post}</p>
          </div>
        ))}
      </div>

      {/* Complaint Box */}
      <div className="office-complaint-card">
        <h2 className="office-complaint-title">😟 Facing any problem?</h2>
        <p className="office-complaint-sub">
          Have an issue with the office, house tutors, or hall administration?
          Let us know below.
        </p>

        <form onSubmit={handleSubmit} className="office-form">
          <textarea
            className="office-textarea"
            rows={4}
            placeholder="Write your complaint about the office or administration here..."
            value={complaint}
            onChange={e => setComplaint(e.target.value)}
          />

          {error   && <p className="office-error">⚠️ {error}</p>}
          {success && <p className="office-success">{success}</p>}

          <button type="submit" className="office-submit" disabled={loading}>
            {loading ? 'Submitting...' : '📩 Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Office;