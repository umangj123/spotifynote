// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles.css';

// function FeedPage() {
//   const [notes, setNotes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNotes = async () => {
//       const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
//       const querySnapshot = await getDocs(q);
//       setNotes(querySnapshot.docs.map((doc) => doc.data()));
//     };

//     fetchNotes();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <div className="container">
//       <nav>
//         <ul>
//           <li>
//             <Link to="/spotify">Spotify</Link>
//           </li>
//           <li>
//             <button onClick={handleLogout}>Logout</button>
//           </li>
//         </ul>
//       </nav>
//       <h2>Feed Page</h2>
//       <div>
//         {notes.map((note, index) => (
//           <div key={index}>
//             <p>{note.note}</p>
//             <small>{note.timestamp?.toDate().toString()}</small>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FeedPage;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles.css';

// function FeedPage() {
//   const [notes, setNotes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const q = query(collection(db, 'notes'), orderBy('timestamp', 'desc'));
//         const querySnapshot = await getDocs(q);
//         const notesList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setNotes(notesList);
//       } catch (error) {
//         console.error('Error fetching notes:', error);
//       }
//     };

//     fetchNotes();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <div className="container">
//       <nav>
//         <ul>
//           <li>
//             <Link to="/spotify">Spotify</Link>
//             <Link>Nami Meri Jaan [Coming Soon]</Link>
//           </li>
//           <li>
//             <button onClick={handleLogout}>Logout</button>
//           </li>
//         </ul>
//       </nav>
//       <h2>Feed Page</h2>
//       <div className="notes-section">
//         {notes.map((note) => (
//           <div key={note.id} className="note-card">
//             <p><strong>Spotify User:</strong> {note.spotifyUser}</p>
//             <p><strong>Email:</strong> {note.user}</p>
//             <p><strong>Song:</strong> {note.songName}</p>
//             <p><strong>Note:</strong> {note.note}</p>
//             <p><small><strong>Time:</strong> {note.timestamp?.toDate().toLocaleString()}</small></p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FeedPage;

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

function FeedPage() {
  const [notes, setNotes] = useState([]);
  const [newReplies, setNewReplies] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, 'notes'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleReplyChange = (noteId, value) => {
    setNewReplies({ ...newReplies, [noteId]: value });
  };

  const handleReplySubmit = async (noteId) => {
    const replyText = newReplies[noteId];
    if (replyText) {
      try {
        const noteRef = doc(db, 'notes', noteId);
        
        // Fetch the current replies
        const noteSnapshot = await getDoc(noteRef);
        const currentReplies = noteSnapshot.exists() ? noteSnapshot.data().replies || [] : [];

        const userEmail = auth.currentUser.email;
        const newReply = {
          email: userEmail,
          text: replyText,
        };
  
        // Add the new reply
        const updatedReplies = [...currentReplies, newReply];
  
        // Update Firestore
        await updateDoc(noteRef, {
          replies: updatedReplies
        });
  
        // Update local state
        setNotes(notes.map(note =>
          note.id === noteId ? { ...note, replies: updatedReplies } : note
        ));
        setNewReplies({ ...newReplies, [noteId]: '' });
      } catch (error) {
        console.error('Error submitting reply:', error);
      }
    }
  };

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <Link to="/spotify">Spotify</Link>
            <Link to="/nami">Nami Meri Jaan</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      <h2>Feed Page</h2>
      <div className="notes-section">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <p><strong>Spotify User:</strong> {note.spotifyUser}</p>
            <p><strong>Email:</strong> {note.user}</p>
            <p><strong>Song:</strong> {note.songName}</p>
            <p><strong>Note:</strong> {note.note}</p>
            <p><small><strong>Time:</strong> {note.timestamp?.toDate().toLocaleString()}</small></p>

            {/* Replies Section */}
            <div className="replies-section">
              <strong>Replies:</strong>
              {/* <ul> */}
                {(note.replies || []).map((reply, index) => (
                  <li key={index}>
                    {reply.email}: {reply.text} 
                    {/* <small>({new Date(reply.timestamp.seconds * 1000).toLocaleString()})</small> */}
                  </li>
                ))}
              {/* </ul> */}
              <input
                type="text"
                placeholder="Write a reply..."
                value={newReplies[note.id] || ''}
                onChange={(e) => handleReplyChange(note.id, e.target.value)}
              />
              <button onClick={() => handleReplySubmit(note.id)}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;

