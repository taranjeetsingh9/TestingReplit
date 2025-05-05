import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Gallery images
const galleryImages = [
  {
    src: "https://kiryxkelcxqzcgnwrmbj.supabase.co/storage/v1/object/public/partyimages//WhatsApp%20Image%202025-04-29%20at%2010.44.40%20PM-4.jpeg",
    alt: "The Journey Begins",
    caption: "The Journey Begins"
  },
  {
    src: "https://kiryxkelcxqzcgnwrmbj.supabase.co/storage/v1/object/public/partyimages//WhatsApp%20Image%202025-04-29%20at%2010.44.40%20PM-3.jpeg",
    alt: "Moments of Joy",
    caption: "Moments of Joy"
  }
];

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
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
  
  // Navigate through images in lightbox
  const goToPrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
  };
  
  const goToNext = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-16 px-4 relative">
      <div className="container mx-auto max-w-5xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold relative inline-block">
              <span className="relative z-10">Memories that led to this celebration</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-softPink opacity-50 z-0"></span>
            </h2>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={itemVariants}>
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-lg h-64 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain bg-softPink/10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <p className="text-white p-4 font-medium">{image.caption}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Lightbox Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
          <AnimatePresence mode="wait">
            {selectedImage !== null && (
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <img
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].alt}
                  className="w-full max-h-[80vh] object-contain rounded-lg bg-softPink/10"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-lg font-medium">
                  {galleryImages[selectedImage].caption}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
