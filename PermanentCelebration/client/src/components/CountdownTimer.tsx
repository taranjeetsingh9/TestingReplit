import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Event date: May 17, 2025, 17:00:00
const EVENT_DATE = new Date('2025-05-17T17:00:00').getTime();

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE - now;
      
      if (distance < 0) {
        // Event has passed
        clearInterval(interval);
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
        return;
      }
      
      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  const numberVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };
  
  // Background animation elements
  const decorationElements = [
    { id: 1, emoji: '✨', position: 'top-5 left-5', size: 'text-2xl', delay: 0 },
    { id: 2, emoji: '🎉', position: 'top-10 right-10', size: 'text-2xl', delay: 0.3 },
    { id: 3, emoji: '🎊', position: 'bottom-5 left-1/4', size: 'text-2xl', delay: 0.6 },
    { id: 4, emoji: '✨', position: 'bottom-10 right-1/4', size: 'text-2xl', delay: 0.9 },
  ];

  return (
    <section id="countdown" className="py-16 px-4 relative bg-gradient-to-b from-softPink/30 to-softWhite overflow-hidden">
      {/* Animated decoration elements */}
      {decorationElements.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute ${item.position} ${item.size} opacity-60 z-0`}
          animate={{
            y: [-10, 10, -10],
            scale: [1, 1.2, 1],
            rotate: item.id % 2 === 0 ? [0, 10, -10, 0] : 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 5 + item.id,
            ease: item.id % 2 === 0 ? "easeInOut" : "linear",
            delay: item.delay,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
      
      <div className="container mx-auto max-w-4xl relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-2">
              ⏳ Just a Few Days Left Until the Big Night!
            </h2>
            <p className="text-lg text-charcoal/70">Mark your calendars and join us for this special occasion</p>
          </motion.div>
          
          <motion.div className="flex flex-wrap justify-center gap-4 md:gap-8" variants={itemVariants}>
            <motion.div 
              className="countdown-item rounded-2xl w-20 h-24 md:w-28 md:h-32 flex flex-col items-center justify-center shadow-[8px_8px_16px_#e3e3e3,-8px_-8px_16px_#ffffff] bg-softWhite relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-champagneGold to-yellow-200 opacity-20 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                key={timeLeft.days}
                variants={numberVariants}
                initial="initial"
                animate="animate"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl md:text-5xl font-bold text-champagneGold relative z-10"
              >
                {timeLeft.days}
              </motion.div>
              <div className="text-sm md:text-base mt-1 text-charcoal/70 relative z-10">Days</div>
            </motion.div>
            
            <motion.div 
              className="countdown-item rounded-2xl w-20 h-24 md:w-28 md:h-32 flex flex-col items-center justify-center shadow-[8px_8px_16px_#e3e3e3,-8px_-8px_16px_#ffffff] bg-softWhite relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-champagneGold to-yellow-200 opacity-20 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                key={timeLeft.hours}
                variants={numberVariants}
                initial="initial"
                animate="animate"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl md:text-5xl font-bold text-champagneGold relative z-10"
              >
                {timeLeft.hours}
              </motion.div>
              <div className="text-sm md:text-base mt-1 text-charcoal/70 relative z-10">Hours</div>
            </motion.div>
            
            <motion.div 
              className="countdown-item rounded-2xl w-20 h-24 md:w-28 md:h-32 flex flex-col items-center justify-center shadow-[8px_8px_16px_#e3e3e3,-8px_-8px_16px_#ffffff] bg-softWhite relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-champagneGold to-yellow-200 opacity-20 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                key={timeLeft.minutes}
                variants={numberVariants}
                initial="initial"
                animate="animate"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl md:text-5xl font-bold text-champagneGold relative z-10"
              >
                {timeLeft.minutes}
              </motion.div>
              <div className="text-sm md:text-base mt-1 text-charcoal/70 relative z-10">Minutes</div>
            </motion.div>
            
            <motion.div 
              className="countdown-item rounded-2xl w-20 h-24 md:w-28 md:h-32 flex flex-col items-center justify-center shadow-[8px_8px_16px_#e3e3e3,-8px_-8px_16px_#ffffff] bg-softWhite relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-champagneGold to-yellow-200 opacity-20 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                key={timeLeft.seconds}
                variants={numberVariants}
                initial="initial"
                animate="animate"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl md:text-5xl font-bold text-champagneGold relative z-10"
              >
                {timeLeft.seconds}
              </motion.div>
              <div className="text-sm md:text-base mt-1 text-charcoal/70 relative z-10">Seconds</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
