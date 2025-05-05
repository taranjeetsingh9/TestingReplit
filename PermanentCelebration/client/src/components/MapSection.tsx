import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function MapSection() {
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

  return (
    <section id="location" className="py-16 px-4 relative">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold relative inline-block">
              <span className="relative z-10">Location</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-softPink opacity-50 z-0"></span>
            </h2>
            <p className="text-lg mt-4 text-charcoal/70">Join us at this beautiful venue in Brampton</p>
          </motion.div>
          
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-lg bg-white/15 backdrop-blur-md border border-white/20"
            variants={itemVariants}
          >
            <div className="h-80 relative">
              {/* We'll add the Google Maps iframe with the actual address later */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.7150095551416!2d-79.7869762!3d43.695844000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b158287ccb75d%3A0x59a5b3d7eb2b5db6!2s73%20Bonnie%20Braes%20Dr%2C%20Brampton%2C%20ON%20L6Y%200Y6%2C%20Canada!5e0!3m2!1sen!2sus!4v1685289456421!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location"
                className="w-full h-full"
              ></iframe>
              
              {/* Fallback content in case the map doesn't load */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4 bg-white/90 rounded-lg">
                  <MapPin className="h-8 w-8 text-champagneGold mx-auto mb-3" />
                  <p className="text-lg font-medium">PR Celebration Venue</p>
                  <p>73 Bonnie Braes Dr, Brampton, ON L6Y 0Y6</p>
                  <a href="https://www.google.com/maps/place/73+Bonnie+Braes+Dr,+Brampton,+ON+L6Y+0Y6,+Canada/" target="_blank" rel="noreferrer" className="text-sparkleGold hover:underline mt-2 inline-block">
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
