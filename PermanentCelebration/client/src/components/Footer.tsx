import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Facebook, Instagram, Share2, MessageCircle } from 'lucide-react';

export function Footer() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };
  
  const handleShare = async () => {
    const title = "Tejinder's PR Celebration";
    const text = "You're invited to celebrate Mrs. Tejinder Kaur Mundra's PR milestone!";
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(url);
        alert('Invitation link copied to clipboard!');
      } catch (error) {
        alert('Copy this link to share: ' + url);
      }
    }
  };

  return (
    <footer className="py-16 px-4 relative bg-gradient-to-b from-softPink/30 to-softPink/50">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="font-dancing text-3xl md:text-4xl text-sparkleGold mb-4">Thank you</div>
            <p className="text-lg text-charcoal/70">We are excited to share this special occasion with you</p>
            <p className="text-md mt-2">- Manjinder Singh Mundra & Family</p>
          </motion.div>
          
          <motion.div className="mt-10 text-center" variants={itemVariants}>
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-charcoal hover:bg-champagneGold/20 transition duration-300 bg-white/15 backdrop-blur-md border border-white/20"
            >
              <Share2 className="h-5 w-5" />
              <span>Share this Invite</span>
            </button>
          </motion.div>
          
          <motion.div className="mt-8 flex justify-center space-x-6" variants={itemVariants}>
            <a href="#" className="text-champagneGold hover:text-sparkleGold transition duration-300">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/tejinder_mundra0004?igsh=cXZ5MXhjbTlkcWV2" target="_blank" rel="noreferrer" className="text-champagneGold hover:text-sparkleGold transition duration-300">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-champagneGold hover:text-sparkleGold transition duration-300">
              <MessageCircle className="h-6 w-6" />
            </a>
          </motion.div>
          
          <motion.div className="mt-10 text-center text-xs text-charcoal/50" variants={itemVariants}>
            <p>Designed & Developed by Taranjeet Singh</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
