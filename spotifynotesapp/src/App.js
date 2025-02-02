import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import SpotifyPage from './pages/SpotifyPage';
import FlowerBouquet from './pages/FlowerBouquet';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles.css';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isSpotifyRedirect = window.location.search.includes('code='); // Check if "code" exists in the URL

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/feed" /> : <LoginPage />} 
        />
        <Route 
          path="/feed" 
          element={user ? <FeedPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/nami" 
          element={user ? <FlowerBouquet/> : <Navigate to="/" />} 
        />
        <Route
          path="/spotify"
          element={user || isSpotifyRedirect ? <SpotifyPage /> : <Navigate to="/" />} // Allow access if user is authenticated or redirected with code
        />
      </Routes>
    </Router>
  );
}

export default App;
