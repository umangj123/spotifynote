// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchProfile, fetchPlaylists, getAccessToken, redirectToAuthCodeFlow } from '../spotify';
// import { db } from '../firebase';
// import { setDoc, doc } from 'firebase/firestore';
// import '../spotifyStyles.css';

// function SpotifyPage() {
//   const [profile, setProfile] = useState(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [tracks, setTracks] = useState([]);
//   const navigate = useNavigate();
//   const code = new URLSearchParams(window.location.search).get('code');
//   const accessToken = localStorage.getItem('accessToken');

//   useEffect(() => {
//     console.log('code:', code);
//     console.log('accessToken:', accessToken);

//     if (code) {
//       // If the user is redirected with a code, get the access token
//       console.log('Received code from URL:', code);
//       getAccessToken(code).then(async (token) => {
//         if (token) {
//           console.log('Access token received:', token);
//           localStorage.setItem('accessToken', token);

//           // Fetch the user profile and playlists after obtaining the token
//           const userProfile = await fetchProfile(token);
//           setProfile(userProfile);
//           fetchPlaylists(token).then((data) => setPlaylists(data.items));
          
//           // Navigate to /spotify after successfully getting the profile data
//           navigate('/spotify');
//         } else {
//           console.log('No access token found, navigating to feed');
//           navigate('/feed');
//         }
//       });
//     } else if (!accessToken) {
//       // If there's no access token, initiate the OAuth flow
//       console.log('No access token and no code, redirecting to OAuth flow');
//       redirectToAuthCodeFlow();
//     } else {
//       // If access token is available, fetch the profile and playlists directly
//       console.log('Access token found, fetching profile and playlists');
//       fetchProfile(accessToken).then((userProfile) => setProfile(userProfile));
//       fetchPlaylists(accessToken).then((data) => setPlaylists(data.items));
//     }
//   }, [code, accessToken, navigate]);

//   const saveNote = async (songId, note) => {
//     const noteRef = doc(db, "notes", songId);
//     await setDoc(noteRef, {
//       note,
//       timestamp: new Date(),
//     });
//   };

//   const fetchPlaylistTracks = async (playlistId) => {
//     const token = localStorage.getItem('accessToken');
//     const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//       method: 'GET',
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (result.ok) {
//       const data = await result.json();
//       setTracks(data.items);
//     } else {
//       console.error('Failed to fetch tracks');
//     }
//   };

//   const createNoteForSong = (songId) => {
//     const note = prompt('Enter a note for this song:');
//     if (note) {
//       saveNote(songId, note);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Spotify Page</h2>
//       {profile && (
//         <>
//           <h3>{profile.display_name}</h3>
//           <img src={profile.images[0]?.url} alt="Profile" width="100" />
//         </>
//       )}

//       <div id="playlists">
//         {playlists.map((playlist) => (
//           <div key={playlist.id} className="playlist">
//             <strong>{playlist.name}</strong>
//             <button onClick={() => fetchPlaylistTracks(playlist.id)}>Show Tracks</button>
//           </div>
//         ))}
//       </div>

//       <div id="tracks">
//         {tracks.length > 0 && (
//           <div>
//             {tracks.map((track) => (
//               <div key={track.track.id}>
//                 <strong>{track.track.name}</strong> by {track.track.artists[0].name}
//                 <button onClick={() => createNoteForSong(track.track.id)}>Create Note</button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SpotifyPage;

// // src/pages/SpotifyPage.js
// // src/pages/SpotifyPage.js
// // import React, { useEffect, useState } from 'react';
// // import { fetchProfile, fetchPlaylists, fetchPlaylistTracks, getAccessToken, redirectToAuthCodeFlow } from '../spotify';
// // import { useNavigate } from 'react-router-dom';
// // import '../spotifyStyles.css'; // New CSS file

// // function SpotifyPage() {
// //   const [profile, setProfile] = useState(null);
// //   const [playlists, setPlaylists] = useState([]);
// //   const [tracks, setTracks] = useState([]);
// //   const navigate = useNavigate();
// //   const code = new URLSearchParams(window.location.search).get('code');
// //   const accessToken = localStorage.getItem('accessToken');

// //   useEffect(() => {
// //     if (code) {
// //       getAccessToken(code).then(async (token) => {
// //         if (token) {
// //           localStorage.setItem('accessToken', token);
// //           const userProfile = await fetchProfile(token);
// //           setProfile(userProfile);
// //           fetchPlaylists(token).then((data) => setPlaylists(data.items));
// //         }
// //       });
// //     } else if (!accessToken) {
// //       redirectToAuthCodeFlow();
// //     } else {
// //       fetchProfile(accessToken).then((userProfile) => setProfile(userProfile));
// //       fetchPlaylists(accessToken).then((data) => setPlaylists(data.items));
// //     }
// //   }, [code, accessToken]);

// //   const handlePlaylistClick = async (playlistId) => {
// //     const token = localStorage.getItem('accessToken');
// //     const data = await fetchPlaylistTracks(playlistId, token);
// //     setTracks(data.items);
// //   };

// //   return (
// //     <div className="spotify-page">
// //       <div className="user-info">
// //         {profile && (
// //           <>
// //             <img src={profile.images[0]?.url} alt="Profile" className="profile-pic" />
// //             <h2>Welcome, {profile.display_name}</h2>
// //             <p>ID: {profile.id}</p>
// //             <p>Email: {profile.email}</p>
// //           </>
// //         )}
// //       </div>

// //       <div className="playlists-container">
// //         <h3>Your Playlists</h3>
// //         <div className="playlists">
// //           {playlists.map((playlist) => (
// //             <button
// //               key={playlist.id}
// //               className="playlist-button"
// //               onClick={() => handlePlaylistClick(playlist.id)}
// //             >
// //               {playlist.name}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {tracks.length > 0 && (
// //         <div className="tracks-container">
// //           <h3>Tracks in Playlist</h3>
// //           <div className="tracks">
// //             {tracks.map((track) => (
// //               <div key={track.track.id} className="track">
// //                 <span>{track.track.name} by {track.track.artists[0].name}</span>
// //                 <button className="note-button">Create Note</button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default SpotifyPage;

// // src/pages/SpotifyPage.js
// import React, { useEffect, useState } from 'react';
// import { fetchProfile, fetchPlaylists, fetchPlaylistTracks, getAccessToken, redirectToAuthCodeFlow } from '../spotify';
// import { useNavigate } from 'react-router-dom';
// import '../spotifyStyles.css';

// function SpotifyPage() {
//   const [profile, setProfile] = useState(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [tracks, setTracks] = useState([]);
//   const navigate = useNavigate();
//   const code = new URLSearchParams(window.location.search).get('code');
//   const accessToken = localStorage.getItem('accessToken');

//   useEffect(() => {
//     if (code) {
//       getAccessToken(code).then(async (token) => {
//         if (token) {
//           localStorage.setItem('accessToken', token);
//           const userProfile = await fetchProfile(token);
//           setProfile(userProfile);
//           fetchPlaylists(token).then((data) => setPlaylists(data.items));
//         }
//       });
//     } else if (!accessToken) {
//       redirectToAuthCodeFlow();
//     } else {
//       fetchProfile(accessToken).then((userProfile) => setProfile(userProfile));
//       fetchPlaylists(accessToken).then((data) => setPlaylists(data.items));
//     }
//   }, [code, accessToken]);

//   const handlePlaylistClick = async (playlistId) => {
//     console.log("Fetching tracks for playlist ID:", playlistId);
//     const token = localStorage.getItem('accessToken');
//     const data = await fetchPlaylistTracks(playlistId, token);
//     console.log("Fetched tracks:", data);
//     setTracks(data.items);
//   };

//   return (
//     <div className="spotify-page">
//       <div className="user-info">
//         {profile && (
//           <>
//             <img src={profile.images[0]?.url} alt="Profile" className="profile-pic" />
//             <h2>Welcome, {profile.display_name}</h2>
//             <p>ID: {profile.id}</p>
//             <p>Email: {profile.email}</p>
//           </>
//         )}
//       </div>

//       <div className="playlists-container">
//         <h3>Your Playlists</h3>
//         <div className="playlists">
//           {playlists.map((playlist) => (
//             <button
//               key={playlist.id}
//               className="playlist-button"
//               onClick={() => handlePlaylistClick(playlist.id)}
//             >
//               {playlist.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {tracks.length > 0 && (
//         <div className="tracks-container">
//           <h3>Tracks in Playlist</h3>
//           <div className="tracks">
//           {tracks.map((track) => (
//             <div key={`${track.track.id}-${track.track.name}`} className="track">
//                 <span>{track.track.name} by {track.track.artists[0].name}</span>
//                 <button className="note-button">Create Note</button>
//             </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SpotifyPage;

// import React, { useState, useEffect } from 'react';
// import { fetchPlaylists, fetchProfile, getAccessToken } from '../spotify';
// import { useNavigate } from 'react-router-dom';
// import '../styles.css';

// function SpotifyPage() {
//   const [profile, setProfile] = useState(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [tracks, setTracks] = useState([]);
//   const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
//   const navigate = useNavigate();
//   const code = new URLSearchParams(window.location.search).get('code');
//   const accessToken = localStorage.getItem('accessToken');

//   useEffect(() => {
//     console.log('code:', code);
//     console.log('accessToken:', accessToken);

//     if (code) {
//       // If the user is redirected with a code, get the access token
//       console.log('Received code from URL:', code);
//       getAccessToken(code).then(async (token) => {
//         if (token) {
//           console.log('Access token received:', token);
//           localStorage.setItem('accessToken', token);

//           // Fetch the user profile and playlists after obtaining the token
//           const userProfile = await fetchProfile(token);
//           setProfile(userProfile);
//           fetchPlaylists(token).then((data) => setPlaylists(data.items));
//         } else {
//           console.log('No access token found, navigating to feed');
//           navigate('/feed');
//         }
//       });
//     } else if (!accessToken) {
//       // If there's no access token, initiate the OAuth flow
//       console.log('No access token and no code, redirecting to OAuth flow');
//       redirectToAuthCodeFlow();
//     } else {
//       // If access token is available, fetch the profile and playlists directly
//       console.log('Access token found, fetching profile and playlists');
//       fetchProfile(accessToken).then((userProfile) => setProfile(userProfile));
//       fetchPlaylists(accessToken).then((data) => setPlaylists(data.items));
//     }
//   }, [code, accessToken, navigate]);

//   const fetchPlaylistTracks = async (playlistId) => {
//     const token = localStorage.getItem('accessToken');
//     console.log(`Fetching tracks for playlist ID: ${playlistId}`);
    
//     const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//       method: 'GET',
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await result.json();
//     console.log('Fetched tracks:', data);
    
//     if (data.items) {
//       setTracks(data.items);
//       setExpandedPlaylistId(playlistId); // Update the expanded state to show the tracks
//     } else {
//       console.error('No tracks found');
//     }
//   };

//   return (
//     <div className="spotify-container">
//       <div className="profile-section">
//         <img src={profile?.images[0]?.url} alt="Profile" className="profile-pic" />
//         <h2>Welcome, {profile?.display_name}</h2>
//         <p>User ID: {profile?.id}</p>
//         <p>Email: {profile?.email}</p>
//       </div>

//       <div className="playlists-section">
//         <h3>Your Playlists</h3>
//         {playlists.length > 0 ? (
//           playlists.map((playlist) => (
//             <div key={playlist.id} className="playlist-card">
//               <button
//                 onClick={() => fetchPlaylistTracks(playlist.id)}
//                 className="playlist-button"
//               >
//                 {playlist.name}
//               </button>
//               {expandedPlaylistId === playlist.id && tracks.length > 0 && (
//                 <div className="track-list">
//                   {tracks.map((track) => (
//                     <div key={track.track.id} className="track-item">
//                       <span>{track.track.name} by {track.track.artists[0].name}</span>
//                       <button className="note-button">Create Note</button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No playlists found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SpotifyPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchPlaylists, getAccessToken, redirectToAuthCodeFlow } from '../spotify';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import '../spotifyStyles.css';

function SpotifyPage() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
  const navigate = useNavigate();
  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    console.log('code:', code);
    console.log('accessToken:', accessToken);
  
    if (code) {
      // If the user is redirected with a code, get the access token
      console.log('Received code from URL:', code);
      getAccessToken(code).then(async (token) => {
        if (token) {
          console.log('Access token received:', token);
          localStorage.setItem('accessToken', token);
  
          // Fetch the user profile and playlists after obtaining the token
          const userProfile = await fetchProfile(token);
          setProfile(userProfile);
  
          if (!userProfile || !userProfile.images || userProfile.images.length === 0) {
            // If profile image is missing, redirect to the OAuth flow
            console.log('No Spotify profile connected, redirecting to OAuth');
            redirectToAuthCodeFlow();
          } else {
            fetchPlaylists(token).then((data) => setPlaylists(data.items));
          }
          
          // Navigate to /spotify after successfully getting the profile data
          navigate('/spotify');
        } else {
          console.log('No access token found, navigating to feed');
          navigate('/feed');
        }
      });
    } else if (!accessToken) {
      // If there's no access token, initiate the OAuth flow
      console.log('No access token and no code, redirecting to OAuth flow');
      redirectToAuthCodeFlow();
    } else {
      // If access token is available, fetch the profile and playlists directly
      console.log('Access token found, fetching profile and playlists');
      fetchProfile(accessToken).then((userProfile) => {
        setProfile(userProfile);
        if (!userProfile || !userProfile.images || userProfile.images.length === 0) {
          // If profile image is missing, redirect to OAuth
          console.log('No Spotify profile connected, redirecting to OAuth');
          redirectToAuthCodeFlow();
        } else {
          fetchPlaylists(accessToken).then((data) => setPlaylists(data.items));
        }
      });
    }
  }, [code, accessToken, navigate]);
  

//   const saveNote = async (songId, note) => {
//     const noteRef = doc(db, "notes", songId);
//     await setDoc(noteRef, {
//       note,
//       timestamp: new Date(),
//     });
//   };

const saveNote = async (songId, songName, note, spotifyUser) => {
    const user = auth.currentUser;  // Get the current authenticated user
    if (user) {
      const noteRef = doc(db, "notes", songId);
      await setDoc(noteRef, {
        note,
        timestamp: new Date(),
        userId: user.uid,  // Add the userId field
        songId,
        songName: songName,
        spotifyUser: spotifyUser,
        user: user.email
      });
    } else {
      console.log('User is not authenticated');
    }
  };
  

  const fetchPlaylistTracks = async (playlistId) => {
    const token = localStorage.getItem('accessToken');
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.ok) {
      const data = await result.json();
      setTracks(data.items);
      setExpandedPlaylistId(playlistId); // Expand the playlist when clicked
    } else {
      console.error('Failed to fetch tracks');
    }
  };

  const createNoteForSong = (songId, songName) => {
    const note = prompt('Enter a note for this song:');
    if (note) {
      saveNote(songId, songName, note, profile.id);
    }
  };

  return (
    <div className="spotify-container">
        <nav>
        <button onClick={() => navigate('/feed')} className="back-to-feed-button">
          Back to Feed
        </button>
      </nav>
      <div className="profile-section">
        <img src={profile?.images[0]?.url} alt="Profile" className="profile-pic" />
        <h2>Welcome, {profile?.display_name}</h2>
      </div>

      <div className="playlists-section">
        <h3>Your Playlists</h3>
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <button
              className="playlist-button"
              onClick={() => fetchPlaylistTracks(playlist.id)}
            >
              {playlist.name}
            </button>

            {/* Show tracks if the playlist is expanded */}
            {expandedPlaylistId === playlist.id && tracks.length > 0 && (
              <div className="track-list">
                {tracks.map((track) => (
                  <div key={track.track.id} className="track-item">
                    <span className="track-name">{track.track.name} by {track.track.artists[0].name}</span>
                    <button
                      className="note-button"
                      onClick={() => createNoteForSong(track.track.id, track.track.name)}
                    >
                      Create Note
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotifyPage;
