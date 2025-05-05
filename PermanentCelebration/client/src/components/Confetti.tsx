import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

export function Confetti() {
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Auto-remove confetti after some time
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);
  
  if (!showConfetti) return null;
  
  return (
    <ReactConfetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={200}
      colors={['#f9d5e5', '#e6c89c', '#d4af37', '#ffffff', '#f8f9fa']}
      gravity={0.1}
      confettiSource={{
        x: windowDimensions.width / 2,
        y: windowDimensions.height / 3,
        w: 0,
        h: 0
      }}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
    />
  );
}
