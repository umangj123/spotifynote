import { useState, useEffect } from 'react';
import '../flower.css';

const Envelope = ({ isOpen, onClose }) => {
  return (
    <div className="envelope-wrapper">
      <div className={`envelope ${isOpen ? 'open' : ''}`}>
        <div className="body"></div>
        <div className="letter">
          <div className="letter-content">
            <h2>For Nami Meri Jaan,</h2>
            <p>Dear Nami,<br />
            I have something very important to ask you.
              Will you be my valentine this year?
              <br />
              P.S. there is only one right answer.</p>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowerBouquet = () => {
  const [flowers, setFlowers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const createFlowers = () => {
      // All stems emerge from center of pot, then fan out by angle (-28° to 28°)
      const newFlowers = Array.from({ length: 58 }).map((_, i) => ({
        id: i,
        angle: Math.random() * 56 - 28,
        delay: Math.random() * 3,
        color: ['#FF0000', '#FF69B4', '#800080', '#FFA500'][Math.floor(Math.random() * 4)],
        size: Math.random() * 38 + 68,
        sway: Math.random() * 4 + 2
      }));
      setFlowers(newFlowers);
    };
    createFlowers();
  }, []);

  const handleButtonClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsOpen(true), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bouquet-container">
      <div className="vase">
        <div className="vase-top"></div>
        <div className="vase-body"></div>
      </div>

      {flowers.map(flower => (
        <div
          key={flower.id}
          className="flower"
          style={{
            left: '50%',
            animationDelay: `${flower.delay}s`,
            '--flower-angle': `${flower.angle}deg`,
            '--flower-height': `${Math.random() * 16 + 44}vh`,
            '--sway-duration': `${flower.sway}s`
          }}
        >
          <div className="stem">
            <div className="leaves">
              {Array.from({ length: 3 }).map((_, i) => (
                <svg
                  key={i}
                  className="leaf"
                  viewBox="0 0 50 50"
                  style={{
                    left: `${Math.random() * 40 - 20}px`,
                    bottom: `${Math.random() * 80 + 10}%`,
                    transform: `rotate(${Math.random() * 40 - 20}deg)`
                  }}
                >
                  <path
                    fill="#3d8f3d"
                    d="M25 5 Q30 15 35 5 Q40 0 30 10 Q25 20 20 10 Q10 0 15 5 Q20 15 25 5"
                  />
                </svg>
              ))}
            </div>
          </div>
          <svg
            className="petals"
            viewBox="0 0 100 100"
            style={{ 
              width: flower.size, 
              height: flower.size,
              filter: `drop-shadow(0 0 12px ${flower.color}80)`
            }}
          >
            <circle cx="50" cy="50" r="14" fill="#FFD700" />
            {/* Inner ring – smaller petals for a fuller bloom */}
            <g transform="translate(50,50) scale(0.55) translate(-50,-50)">
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 30 70 20 Q75 10 60 15 Q50 5 50 10 Q40 5 30 15 Q25 10 30 20 Q40 30 50 10" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(45 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(90 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(135 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(180 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(225 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(270 50 50)" />
              <path fill={flower.color} opacity="0.95" d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(315 50 50)" />
            </g>
            {/* Outer ring – main petals */}
            <path fill={flower.color} d="M50 10 Q60 30 70 20 Q75 10 60 15 Q50 5 50 10 Q40 5 30 15 Q25 10 30 20 Q40 30 50 10" />
            <path fill={flower.color} d="M50 15 Q55 35 65 25 Q70 15 60 20 Q50 10 50 15 Q40 10 35 20 Q30 15 35 25 Q45 35 50 15" transform="rotate(45 50 50)" />
            <path fill={flower.color} d="M50 20 Q60 40 70 30 Q75 20 65 25 Q55 15 50 20 Q45 15 35 25 Q30 20 35 30 Q45 40 50 20" transform="rotate(90 50 50)" />
            <path fill={flower.color} d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(135 50 50)" />
            <path fill={flower.color} d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(180 50 50)" />
            <path fill={flower.color} d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(225 50 50)" />
            <path fill={flower.color} d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(270 50 50)" />
            <path fill={flower.color} d="M50 10 Q60 25 70 15 Q65 5 55 10 Q50 15 45 10 Q35 5 30 15 Q40 25 50 10" transform="rotate(315 50 50)" />
          </svg>
        </div>
      ))}

      <div className="button-container">
        <button 
          className={`message-button ${isAnimating ? 'animating' : ''}`} 
          onClick={handleButtonClick}
        >
          💌 You Have One Unread Message
        </button>
      </div>

      {isAnimating && <Envelope isOpen={isOpen} onClose={handleClose} />}
    </div>
  );
};
export default FlowerBouquet;