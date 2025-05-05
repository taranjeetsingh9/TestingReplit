import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  scrollToRsvp: () => void;
}

export function HeroSection({ scrollToRsvp }: HeroSectionProps) {
  return (
    <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 relative overflow-hidden">
      {/* Background with light opacity */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-softPink/10 to-softWhite/30 absolute z-10"></div>
        <img 
          src="https://kiryxkelcxqzcgnwrmbj.supabase.co/storage/v1/object/public/partyimages//WhatsApp%20Image%202025-04-29%20at%2010.44.41%20PM.jpeg" 
          alt="Celebration background" 
          className="w-full h-full object-contain opacity-20 bg-softPink/10"
        />
      </div>
      
      {/* Floating decorations with enhanced animations */}
      <motion.div 
        className="absolute top-1/4 left-10 text-4xl opacity-70"
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        whileHover={{ scale: 1.5, rotate: [0, -20, 20, 0] }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        🎈
      </motion.div>
      <motion.div 
        className="absolute top-1/5 left-1/4 text-3xl opacity-70"
        animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.2 }}
        whileHover={{ scale: 1.5, opacity: 1 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        🥂
      </motion.div>
      <motion.div 
        className="absolute top-1/3 right-10 text-3xl opacity-70"
        animate={{ y: [-10, 10, -10], scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.3 }}
        whileHover={{ scale: 1.5, rotate: 15 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        ✨
      </motion.div>
      <motion.div 
        className="absolute bottom-1/4 left-1/3 text-4xl opacity-70"
        animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
        whileHover={{ scale: 1.5, rotate: 45 }}
        whileTap={{ scale: 0.8, rotate: -45 }}
      >
        🎉
      </motion.div>
      <motion.div 
        className="absolute top-2/3 right-1/4 text-3xl opacity-70"
        animate={{ y: [-10, 10, -10], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.7 }}
        whileHover={{ scale: 1.5, y: -10 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        🎊
      </motion.div>
      <motion.div 
        className="absolute top-1/2 left-1/5 text-3xl opacity-70"
        animate={{ y: [-5, 5, -5], x: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
        whileHover={{ scale: 1.5, opacity: 1 }}
        whileTap={{ scale: 0.8, rotate: 360 }}
      >
        💫
      </motion.div>
      <motion.div 
        className="absolute bottom-1/3 right-1/5 text-4xl opacity-70"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        whileHover={{ scale: 1.5, opacity: 1 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        ✨
      </motion.div>
      <motion.div 
        className="absolute bottom-1/5 left-10 text-3xl opacity-70"
        animate={{ y: [-8, 8, -8], x: [3, -3, 3], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        whileHover={{ scale: 1.5, rotate: 15 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        🎵
      </motion.div>
      <motion.div 
        className="absolute top-1/5 right-1/5 text-3xl opacity-70"
        animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.8 }}
        whileHover={{ scale: 1.5, rotate: 15 }}
        whileTap={{ scale: 0.8, opacity: 0.6 }}
      >
        🎁
      </motion.div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center",
            "bg-white/15 backdrop-blur-md border border-white/20",
            "shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"
          )}
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 text-charcoal"
          >
            <span className="inline-block">🎉 You're Invited</span><br />
            <span className="text-3xl md:text-4xl font-normal">to a New Beginning!</span>
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-charcoal/80 mb-6 font-medium"
          >
            Celebrating the PR Milestone of<br />
            <span className="font-dancing text-2xl md:text-3xl text-sparkleGold">Mrs. Tejinder Kaur Mundra</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8"
          >
            <div className="flex items-center">
              <span className="text-xl md:text-2xl mr-2">📅</span>
              <span>May 17, 2025</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl md:text-2xl mr-2">🕕</span>
              <span>5:00 PM onwards</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center">
              <span className="text-xl md:text-2xl mr-2">📍</span>
              <span className="text-center">73 Bonnie Braes Dr, Brampton, ON L6Y 0Y6</span>
            </div>
          </motion.div>
          
          <motion.button 
            onClick={scrollToRsvp}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="bg-champagneGold hover:bg-sparkleGold text-white px-6 py-3 rounded-full text-lg font-medium transition duration-300"
          >
            🎟️ RSVP Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
