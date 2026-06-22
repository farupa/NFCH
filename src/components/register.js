import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const DEPARTMENTS = [
  'CSE', 'EEE', 'Civil', 'Mechanical',
  'Architecture', 'Physics', 'Chemistry',
  'Mathematics', 'English', 'Economics',
  'Business', 'Law', 'Other'
];

const VALID_SEATS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const ROOM_RANGES = [
  [301, 312],
  [401, 412],
  [501, 512],
  [601, 612],
  [701, 712],
  [801, 812],
  [901, 912],
  [1001, 1012],
  [1101, 1112],
  [1201, 1212],
  [1301, 1312],
  [1401, 1412],
  [1501, 1512],
  [1601, 1612]
];

function isValidRoomNumber(roomNumber) {
  const num = Number(roomNumber);
  return Number.isInteger(num) && ROOM_RANGES.some(([min, max]) => num >= min && num <= max);
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', batch: '', department: '',
    roomNumber: '', seatNumber: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'seatNumber' ? value.toUpperCase() : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const roomNumber = form.roomNumber.trim();
    const seatNumber = form.seatNumber.trim().toUpperCase();

    if (!isValidRoomNumber(roomNumber)) {
      setError('Room number must be one of the allowed ranges.');
      return;
    }

    if (!VALID_SEATS.includes(seatNumber)) {
      setError('Seat number must be one of A1, A2, B1, B2, C1, C2, D1, or D2.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          roomNumber,
          seatNumber
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      setError('Something went wrong. Please check the backend server and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">🌸 Join NFCH Hall</h2>
        <p className="auth-sub">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <label className="auth-label">Full Name</label>
          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Batch</label>
          <input
            className="auth-input"
            type="text"
            name="batch"
            placeholder="e.g. 2021"
            value={form.batch}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Department</label>
          <select
            className="auth-input"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <label className="auth-label">Room Number</label>
          <input
            className="auth-input"
            type="text"
            name="roomNumber"
            placeholder="e.g. 1302"
            value={form.roomNumber}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Seat Number</label>
          <select
            className="auth-input"
            name="seatNumber"
            value={form.seatNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select seat</option>
            {VALID_SEATS.map(seat => (
              <option key={seat} value={seat}>{seat}</option>
            ))}
          </select>

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="auth-error">⚠️ {error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : '🌸 Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;