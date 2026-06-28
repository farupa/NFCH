import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user  = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌸</span>
          <span className="brand-text">NFCH Hall</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>

          <Link to="/hall-committee" className={`nav-link ${location.pathname === '/hall-committee' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🏛️ হল সংসদ
          </Link>

          <Link to="/alumni" className={`nav-link ${location.pathname === '/alumni' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🎓 Alumni
          </Link>

          <Link to="/canteen" className={`nav-link ${location.pathname === '/canteen' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            🍽️ Canteen
          </Link>

          {token ? (
            <>
              <span className="nav-user">🌸 {user?.name}</span>
              <Link to="/new-post" className="nav-btn" onClick={() => setMenuOpen(false)}>
                ✏️ New Post
              </Link>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn">🌸 Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;