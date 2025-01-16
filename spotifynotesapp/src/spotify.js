
const clientId = "4e4845faee89471fa92824a10e65bce7"; // Your client ID from Spotify

// export async function redirectToAuthCodeFlow() {
//   const verifier = generateCodeVerifier(128);
//   const challenge = await generateCodeChallenge(verifier);

//   localStorage.setItem("verifier", verifier);

//   const params = new URLSearchParams();
//   params.append("client_id", clientId);
//   params.append("response_type", "code");
//   params.append("redirect_uri", "https://unportal.vercel.app/spotify");
//   params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative");
//   params.append("code_challenge_method", "S256");
//   params.append("code_challenge", challenge);

//   document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
// }

export async function redirectToAuthCodeFlow() {
    // Clear any existing tokens and verifiers first
    localStorage.removeItem("accessToken");
    localStorage.removeItem("verifier");
    
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
  
    // Save verifier
    localStorage.setItem("verifier", verifier);
  
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://unportal.vercel.app/spotify");
    //params.append("redirect_uri", "http://localhost:3000/spotify");

    params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    params.append("show_dialog", "true"); // Force showing the auth dialog
  
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
  
  export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");
    
    if (!verifier) {
      console.error("No verifier found");
      return null;
    }
  
    try {
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "https://unportal.vercel.app/spotify");

      //params.append("redirect_uri", "http://localhost:3000/spotify");
      params.append("code_verifier", verifier);
  
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });
  
      if (!result.ok) {
        const errorData = await result.json();
        console.error("Token request failed:", errorData);
        localStorage.removeItem("verifier"); // Clear failed verifier
        return null;
      }
  
      const data = await result.json();
      const accessToken = data.access_token;
  
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.removeItem("verifier"); // Clear used verifier
        return accessToken;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// export async function getAccessToken(code) {
//   const verifier = localStorage.getItem("verifier");

//   const params = new URLSearchParams();
//   params.append("client_id", clientId);
//   params.append("grant_type", "authorization_code");
//   params.append("code", code);
//   params.append("redirect_uri", "https://unportal.vercel.app/spotify");
//   params.append("code_verifier", verifier);

//   const result = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: params
//   });

//   const data = await result.json();
//   const accessToken = data.access_token;

//   if (accessToken) {
//     localStorage.setItem("accessToken", accessToken);
//     return accessToken;
//   } else {
//     console.error("Failed to retrieve access token", data);
//     return null;
//   }
// }

export async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET", 
    headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

export async function fetchPlaylists(token) {
  const result = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (result.ok) {
    return await result.json();
  } else {
    console.error("Failed to fetch playlists", result.status, await result.text());
    return { items: [] };
  }
}

export async function fetchPlaylistTracks(playlistId, token) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (result.ok) {
      return await result.json();
    } else {
      console.error('Failed to fetch playlist tracks', result.status, await result.text());
      return { items: [] };
    }
  }
