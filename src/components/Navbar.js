import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌸</span>
          <span className="brand-text">NFCH Hall</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            to="/new-post"
            className="nav-btn"
            onClick={() => setMenuOpen(false)}
          >
            ✏️ New Post
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;