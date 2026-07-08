import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar        from './components/Navbar';
import Home          from './components/home';
import NewPost       from './components/newpost';
import Register      from './components/register';
import Login         from './components/login';
import HallCommittee from './components/HallCommittee';
import Alumni        from './components/Alumni';
import Canteen       from './components/Canteen';
import Office      from './components/Office';
import Housetutors from './components/Housetutors';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/new-post"       element={<NewPost />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/hall-committee" element={<HallCommittee />} />
            <Route path="/alumni"         element={<Alumni />} />
            <Route path="/canteen"        element={<Canteen />} />
            <Route path="/office"       element={<Office />} />
            <Route path="/Housetutors" element={<Housetutors />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;