import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Confetti burst component — pure CSS confetti pieces
const CONFETTI_COLORS = ['#ff69b4','#ff1493','#ff6b6b','#ffd700','#ff85a2','#ee44aa','#cc33ff','#ff4466','#ffaa00','#44ddff'];
const CONFETTI_COUNT = 60;

const Confetti = () => {
  const pieces = React.useMemo(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 120,
      rotation: Math.random() * 360,
    })),
  []);

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rotation': `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
};

const SOLUTION = 'BEMINE';
const WORD_LENGTH = 6;
const MAX_GUESSES = 6;

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function evaluateGuess(guess, solution) {
  const result = Array(WORD_LENGTH).fill('absent');
  const solChars = [...solution];
  const gChars = [...guess];

  // First pass — exact matches (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (gChars[i] === solChars[i]) {
      result[i] = 'correct';
      solChars[i] = null;
      gChars[i] = null;
    }
  }

  // Second pass — present but wrong position (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (gChars[i] === null) continue;
    const idx = solChars.indexOf(gChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      solChars[idx] = null;
    }
  }

  return result;
}

const WordleGame = () => {
  const navigate = useNavigate();
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');
  const [revealingRow, setRevealingRow] = useState(-1);

  const showMessage = useCallback((msg, duration = 1500) => {
    setMessage(msg);
    if (duration > 0) {
      setTimeout(() => setMessage(''), duration);
    }
  }, []);

  const [checking, setChecking] = useState(false);
  const validWordsCache = React.useRef(new Set([SOLUTION]));

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      showMessage('Not enough letters');
      setTimeout(() => setShake(false), 600);
      return;
    }

    // Validate the word (skip if already validated or is the solution)
    if (!validWordsCache.current.has(currentGuess)) {
      setChecking(true);
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.toLowerCase()}`
        );
        if (!res.ok) {
          setChecking(false);
          setShake(true);
          showMessage('Not in word list');
          setTimeout(() => setShake(false), 600);
          return;
        }
        validWordsCache.current.add(currentGuess);
      } catch {
        // If API is unreachable, accept the word to not block gameplay
      }
      setChecking(false);
    }

    const result = evaluateGuess(currentGuess, SOLUTION);
    const newGuesses = [...guesses, { word: currentGuess, result }];
    setRevealingRow(guesses.length);
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Wait for flip animation to finish before showing end state
    const revealTime = WORD_LENGTH * 150 + 400;
    setTimeout(() => {
      setRevealingRow(-1);
      if (currentGuess === SOLUTION) {
        setWon(true);
        setGameOver(true);
        showMessage('💕', 0);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameOver(true);
        showMessage(SOLUTION, 0);
      }
    }, revealTime);
  }, [currentGuess, guesses, showMessage]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (revealingRow >= 0 || checking) return; // block input during reveal or check

    if (key === 'ENTER') {
      submitGuess();
      return;
    }
    if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }
    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameOver, currentGuess, submitGuess, revealingRow, checking]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') handleKey('ENTER');
      else if (key === 'BACKSPACE') handleKey('⌫');
      else if (/^[A-Z]$/.test(key)) handleKey(key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  // Build keyboard letter states
  const letterStates = {};
  guesses.forEach(({ word, result }, gi) => {
    if (gi === revealingRow) return; // don't spoil during animation
    [...word].forEach((letter, i) => {
      const state = result[i];
      const current = letterStates[letter];
      if (state === 'correct') letterStates[letter] = 'correct';
      else if (state === 'present' && current !== 'correct') letterStates[letter] = 'present';
      else if (!current) letterStates[letter] = 'absent';
    });
  });

  const handleLogout = async () => {
    try { await signOut(auth); navigate('/'); }
    catch (err) { console.error(err); }
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setMessage('');
    setRevealingRow(-1);
  };

  // Build tile rows
  const rows = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      const isRevealing = i === revealingRow;
      rows.push(
        <div className="wordle-row" key={i}>
          {guesses[i].word.split('').map((letter, j) => (
            <div
              key={j}
              className={`wordle-tile ${isRevealing ? 'flip' : 'revealed'} ${guesses[i].result[j]}`}
              style={isRevealing ? { animationDelay: `${j * 150}ms` } : undefined}
            >
              <span className="wordle-tile-front">{letter}</span>
              <span className="wordle-tile-back">{letter}</span>
            </div>
          ))}
        </div>
      );
    } else if (i === guesses.length) {
      const tiles = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        tiles.push(
          <div
            key={j}
            className={`wordle-tile ${currentGuess[j] ? 'filled' : 'empty'}`}
          >
            <span className="wordle-tile-front">{currentGuess[j] || ''}</span>
            <span className="wordle-tile-back">{currentGuess[j] || ''}</span>
          </div>
        );
      }
      rows.push(
        <div className={`wordle-row ${shake ? 'shake' : ''}`} key={i}>{tiles}</div>
      );
    } else {
      rows.push(
        <div className="wordle-row" key={i}>
          {Array(WORD_LENGTH).fill(null).map((_, j) => (
            <div key={j} className="wordle-tile empty">
              <span className="wordle-tile-front"></span>
              <span className="wordle-tile-back"></span>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <Link to="/feed">Feed</Link>
            <Link to="/spotify">Spotify</Link>
            <Link to="/vday25">V-Day 2025</Link>
            <Link to="/vday26">V-Day 2026</Link>
          </li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="wordle-container">
        {message && <div className="wordle-message">{message}</div>}

        <div className="wordle-board">
          {rows}
        </div>

        {gameOver && (
          <div className="wordle-end">
            {won ? (
              <>
                <p className="wordle-win-text">Nami will you be my valentine? 💕</p>
                <Confetti />
              </>
            ) : (
              <p className="wordle-lose-text">The answer was <strong>{SOLUTION}</strong></p>
            )}
            <button className="wordle-play-again" onClick={resetGame}>Play Again</button>
          </div>
        )}

        <div className="wordle-keyboard">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div className="wordle-kb-row" key={ri}>
              {row.map((key) => (
                <button
                  key={key}
                  className={`wordle-key ${letterStates[key] || ''} ${key === 'ENTER' || key === '⌫' ? 'wide' : ''}`}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordleGame;
