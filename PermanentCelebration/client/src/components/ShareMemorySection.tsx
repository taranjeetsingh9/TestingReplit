import { useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Upload, Heart, Gift, Shirt, Send, Eye, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect } from 'react';

// Define memory type
type Memory = {
  id: number;
  name: string;
  message: string;
  photo?: string;
  createdAt: string;
};

import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export function ShareMemorySection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // State for dialogs
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isAttireDialogOpen, setIsAttireDialogOpen] = useState(false);
  const [isViewMemoriesOpen, setIsViewMemoriesOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // State for image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State for password and memories
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Function to refresh memories when needed
  const refetchMemories = () => {
    const stored = localStorage.getItem('pr_party_memories');
    if (stored) {
      try {
        setLocalMemories(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing stored memories:', err);
      }
    }
  };
  
  // Load memories from localStorage
  const [localMemories, setLocalMemories] = useState<Memory[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);
  
  // Load memories from localStorage and API
  useEffect(() => {
    setIsLoadingMemories(true);
    try {
      const stored = localStorage.getItem('pr_party_memories');
      if (stored) {
        setLocalMemories(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading memories from localStorage:', err);
    } finally {
      setIsLoadingMemories(false);
    }
  }, [isViewMemoriesOpen]);
  
  // Create memory mutation
  const createMemoryMutation = useMutation({
    mutationFn: (memoryData: { name: string; message: string; photo?: string }) => {
      return apiRequest("POST", "/api/memories", memoryData);
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
    },
  });
  
  // Effect for animation
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Effect to set preview URL when file is selected
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(selectedFile);
    
    // Cleanup
    return () => {
      fileReader.abort();
    };
  }, [selectedFile]);
  
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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };
  
  // Handle photo upload area click
  const handlePhotoAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle memory submission
  const handleSubmitMemory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameInputRef.current?.value || !messageInputRef.current?.value) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and a message.",
        variant: "destructive"
      });
      return;
    }
    
    // Create memory data
    const memoryData = {
      id: Date.now(), // Use timestamp as ID
      name: nameInputRef.current.value,
      message: messageInputRef.current.value,
      photo: previewUrl || undefined,
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage first
    try {
      const existingMemories = localStorage.getItem('pr_party_memories');
      const memories = existingMemories ? JSON.parse(existingMemories) : [];
      memories.push(memoryData);
      localStorage.setItem('pr_party_memories', JSON.stringify(memories));
      
      // Reset form
      nameInputRef.current!.value = '';
      messageInputRef.current!.value = '';
      setSelectedFile(null);
      setPreviewUrl(null);
      
      toast({
        title: "Memory Shared!",
        description: "Thank you for sharing your memory with Tejinder!",
      });
      
      // Also try sending to API as backup
      createMemoryMutation.mutate(memoryData);
      
    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: "Error Saving Memory",
        description: "There was a problem saving your memory. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle simple prompt for viewing memories
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept any input to make users feel valued and included
    if (password.trim() !== '') {
      setIsAuthenticated(true);
      setIsPasswordDialogOpen(false);
      setIsViewMemoriesOpen(true);
    } else {
      toast({
        title: "Please share something",
        description: "Please enter your favorite color or a special memory to continue.",
        variant: "default"
      });
    }
  };

  return (
    <section id="share-memory" className="py-12 sm:py-16 px-3 sm:px-4 relative bg-softPink/5">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold relative inline-block">
              <span className="relative z-10">Share Your Memories</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-softPink opacity-50 z-0"></span>
            </h2>
            <p className="text-lg mt-4 text-charcoal/70">Help celebrate this special milestone by sharing your favorite memories with Tejinder</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={itemVariants}
          >
            {/* Share Memory Form */}
            <div className="rounded-xl p-6 md:p-8 bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
              <form onSubmit={handleSubmitMemory}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      required 
                      ref={nameInputRef}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="memory" className="block text-sm font-medium mb-1">Your Memory or Message</label>
                    <Textarea
                      id="memory"
                      placeholder="Share a special memory or message for Tejinder..."
                      rows={4}
                      required
                      ref={messageInputRef}
                    />
                  </div>

                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium mb-1">Add a Photo (optional)</label>
                    <div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition duration-300"
                      onClick={handlePhotoAreaClick}
                    >
                      {previewUrl ? (
                        <div className="w-full relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-40 max-w-full mx-auto rounded-md object-contain"
                          />
                          <button 
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                          >
                            <X size={14} />
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-500">Click to upload or drag and drop</div>
                        </div>
                      )}
                      <input 
                        id="photo" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-champagneGold hover:bg-sparkleGold text-white font-medium py-2 rounded-md"
                    disabled={createMemoryMutation.isPending}
                  >
                    {createMemoryMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> Saving...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" /> Share Memory
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Gift and Attire Guidance */}
            <div className="rounded-xl p-6 md:p-8 bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
              <h3 className="text-xl font-dancing text-sparkleGold mb-4">Need Some Help?</h3>
              
              <div className="space-y-6">
                {/* Gift Guidance */}
                <div>
                  <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start py-4 sm:py-6 text-sm sm:text-base bg-white/50 hover:bg-softPink/30 hover:text-sparkleGold border-champagneGold/30 transition-all duration-300"
                      >
                        <Gift className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-champagneGold" />
                        <span>Gift Ideas & Registry</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[85vw] sm:max-w-md bg-white/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl sm:text-2xl font-dancing text-sparkleGold">Gift Guidance</DialogTitle>
                      </DialogHeader>
                      <p className="sr-only" id="gift-dialog-description">Information about gift suggestions for the celebration.</p>
                      <div className="mt-4 space-y-4">
                        <p className="text-center text-gray-600">
                          Your presence is the greatest gift! However, if you'd like to bring something:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="mr-2">🎁</span>
                            <span>Gift cards are always appreciated</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">🏠</span>
                            <span>Home decor items in gold or pink tones</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">🌱</span>
                            <span>Vegetarian-friendly items are preferred</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">💝</span>
                            <span>Consider a contribution to the couple's future adventures</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Attire Guidance */}
                <div>
                  <Dialog open={isAttireDialogOpen} onOpenChange={setIsAttireDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start py-4 sm:py-6 text-sm sm:text-base bg-white/50 hover:bg-softPink/30 hover:text-sparkleGold border-champagneGold/30 transition-all duration-300"
                      >
                        <Shirt className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-champagneGold" />
                        <span>What to Wear?</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[85vw] sm:max-w-md bg-white/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl sm:text-2xl font-dancing text-sparkleGold">Attire Guide</DialogTitle>
                      </DialogHeader>
                      <p className="sr-only" id="attire-dialog-description">Information about what to wear to the celebration.</p>
                      <div className="mt-4 space-y-4">
                        <p className="text-center text-gray-600 font-dancing text-xl">
                          "We are from Punjab, we know how to dress!"
                        </p>
                        <div className="bg-softPink/20 p-6 rounded-lg mt-4 text-center">
                          <p className="text-lg">Dress comfortably and be ready to celebrate!</p>
                          <p className="italic mt-2 text-gray-600">Come as you are, with a heart full of joy</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Contact Host */}
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start py-4 sm:py-6 text-sm sm:text-base bg-white/50 hover:bg-softPink/30 hover:text-sparkleGold border-champagneGold/30 transition-all duration-300"
                    onClick={() => {
                      window.open('https://www.instagram.com/taran.dhamrait9?igsh=MWNyczdoaWk5aXYyZg%3D%3D&utm_source=qr', '_blank');
                    }}
                  >
                    <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-champagneGold" />
                    <span>Contact the Hosts</span>
                  </Button>
                </div>
                
                {/* Direct Admin Access Link */}
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start py-4 sm:py-6 text-sm sm:text-base bg-white/50 hover:bg-softPink/30 hover:text-sparkleGold border-champagneGold/30 transition-all duration-300"
                    onClick={() => {
                      window.location.href = '/admin';
                    }}
                  >
                    <Lock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-champagneGold" />
                    <span>Admin Dashboard</span>
                  </Button>
                </div>
                
                {/* View Memories */}
                <div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start py-4 sm:py-6 text-sm sm:text-base bg-white/50 hover:bg-softPink/30 hover:text-sparkleGold border-champagneGold/30 transition-all duration-300"
                      >
                        <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-champagneGold" />
                        <span>View All Memories</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[85vw] sm:max-w-md bg-white/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl sm:text-2xl font-dancing text-sparkleGold">Join the Celebration</DialogTitle>
                      </DialogHeader>
                      <p className="sr-only" id="password-dialog-description">Share something to view memories.</p>
                      
                      <form onSubmit={handlePasswordSubmit} className="mt-4">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="block text-center text-sm">To view shared memories, please share your favorite color or a special memory of Tejinder:</label>
                            <Input 
                              id="password"
                              type="text"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="e.g., Pink, or 'That time we went to...'"
                              className="border-champagneGold/30"
                              required
                            />
                          </div>
                          <Button 
                            type="submit"
                            className="w-full bg-champagneGold hover:bg-sparkleGold text-white font-medium py-2 rounded-md"
                          >
                            <Heart className="mr-2 h-4 w-4" /> View Memories
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Memories Viewing Dialog */}
      <Dialog open={isViewMemoriesOpen} onOpenChange={setIsViewMemoriesOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl bg-white/90 backdrop-blur-xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl font-dancing text-sparkleGold">Shared Memories</DialogTitle>
          </DialogHeader>
          <p className="sr-only" id="memories-dialog-description">All the shared memories for the event.</p>
          
          <div className="flex-grow overflow-y-auto mt-4 p-2">
            {isLoadingMemories ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-softPink border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="text-gray-500 mt-4">Loading memories...</p>
              </div>
            ) : localMemories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No memories have been shared yet. Be the first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {localMemories.map((memory) => (
                  <div key={memory.id} className="bg-white/60 p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sparkleGold">{memory.name}</h4>
                      <p className="text-xs text-gray-500">{new Date(memory.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <p className="mt-2 text-gray-700">{memory.message}</p>
                    
                    {memory.photo && (
                      <div className="mt-3">
                        <img 
                          src={memory.photo} 
                          alt={`Memory from ${memory.name}`} 
                          className="w-full max-h-40 object-contain rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setIsViewMemoriesOpen(false)}
              className="bg-champagneGold hover:bg-sparkleGold text-white font-medium py-2 rounded-md"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
