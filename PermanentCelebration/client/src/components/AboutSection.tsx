import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export function AboutSection() {
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
    <section id="about" className="py-16 px-4 relative">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold relative inline-block">
              <span className="relative z-10">About The Celebration</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-softPink opacity-50 z-0"></span>
            </h2>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div className="w-full md:w-1/3 relative" variants={itemVariants}>
              <div className="relative w-full h-72 rounded-xl overflow-hidden">
                <img 
                  src="https://kiryxkelcxqzcgnwrmbj.supabase.co/storage/v1/object/public/partyimages//WhatsApp%20Image%202025-04-29%20at%2010.44.41%20PM.jpeg" 
                  alt="Tejinder's journey" 
                  className="w-full h-full object-contain bg-softPink/10"
                />
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://kiryxkelcxqzcgnwrmbj.supabase.co/storage/v1/object/public/partyimages//WhatsApp%20Image%202025-04-29%20at%2010.44.40%20PM.jpeg" 
                  alt="Tejinder's portrait" 
                  className="w-full h-full object-contain bg-softPink/10"
                />
              </div>
              
              <motion.div 
                className="absolute -top-4 -left-4 text-4xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 -right-4 text-3xl"
                animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                🎉
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 left-10 text-3xl"
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                💫
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-2/3 rounded-xl p-6 md:p-8 bg-white/15 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"
              variants={itemVariants}
            >
              <p className="text-lg leading-relaxed mb-4">
                After years of dedication, hard work, and perseverance, we're thrilled to celebrate a significant milestone in Tejinder's life - 
                her Permanent Residency! This journey has been filled with challenges, growth, and beautiful moments that have shaped her into the incredible person she is today.
              </p>
              <p className="text-lg leading-relaxed">
                Join us for an evening of joy, laughter, and celebration as we mark this new chapter in Tejinder's life. Let's come together to share stories, create memories, 
                and toast to new beginnings!
              </p>
              <div className="text-right mt-4 font-dancing text-xl text-sparkleGold">
                - With love and gratitude
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
