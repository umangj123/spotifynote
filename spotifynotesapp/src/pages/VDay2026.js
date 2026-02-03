import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Video ID from https://youtu.be/Vh7_xPFOZ28
const YOUTUBE_VIDEO_ID = 'Vh7_xPFOZ28';

const VDay2026 = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <Link to="/feed">Feed</Link>
            <Link to="/spotify">Spotify</Link>
            <Link to="/vday25">V-Day 2025</Link>
            <Link to="/vday2026">V-Day 2026</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      <h2>V-Day 2026</h2>
      <div className="vday2026-content">
        <div className="vday2026-video-wrapper">
          {YOUTUBE_VIDEO_ID ? (
            <iframe
              title="V-Day 2026"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="vday2026-video"
            />
          ) : (
            <div className="vday2026-placeholder">
              <p>Add your video!</p>
              <p className="vday2026-hint">
                Edit <code>src/pages/VDay2026.js</code> and set <code>YOUTUBE_VIDEO_ID</code> to your video ID (from the URL after <code>?v=</code>).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VDay2026;
