import { useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ImageGallery } from '@/components/ImageGallery';
import { RSVPForm } from '@/components/RSVPForm';
import { MapSection } from '@/components/MapSection';
import { ShareMemorySection } from '@/components/ShareMemorySection';
import { Footer } from '@/components/Footer';
import { Confetti } from '@/components/Confetti';

export default function Home() {
  const rsvpRef = useRef<HTMLDivElement>(null);
  
  const scrollToRsvp = () => {
    rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="font-montserrat bg-gradient-to-b from-softPink/5 via-softWhite to-softPink/20 min-h-screen text-charcoal overflow-x-hidden">
      <Confetti />
      <Navigation scrollToRsvp={scrollToRsvp} />
      <HeroSection scrollToRsvp={scrollToRsvp} />
      <AboutSection />
      <CountdownTimer />
      <ImageGallery />
      <div ref={rsvpRef}>
        <RSVPForm />
      </div>
      <MapSection />
      <ShareMemorySection />
      <Footer />
    </div>
  );
}
