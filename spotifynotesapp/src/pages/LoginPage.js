// // src/pages/LoginPage.js
// import React, { useState } from 'react';
// import { auth } from '../firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import '../loginstyles.css';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//         <h1> Umang and Nami Portal </h1>
//         <div className="container">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//             <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             />
//             <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             />
//             <button type="submit">Login</button>
//         </form>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     </div>
//   );
// }

// export default LoginPage;

import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h1 className="portal-header">The Umang & Nami Portal</h1>
      <div className="logincontainer">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

