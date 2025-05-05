import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  scrollToRsvp: () => void;
}

export function Navigation({ scrollToRsvp }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-40 py-3 px-4 transition-all duration-300",
      "backdrop-blur-md border-b border-white/10",
      scrolled ? "bg-white/70 dark:bg-background/70" : "bg-transparent"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-champagneGold font-dancing text-xl md:text-2xl">Tejinder's Celebration</div>
        <button 
          onClick={scrollToRsvp}
          className="bg-champagneGold hover:bg-sparkleGold text-white px-4 py-2 rounded-full transition duration-300 text-sm md:text-base"
        >
          🎟️ RSVP Now
        </button>
      </div>
    </nav>
  );
}
