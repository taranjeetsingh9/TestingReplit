import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSupabase } from '@/hooks/useSupabase';
import { Confetti } from './Confetti';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone number is required"),
  guests: z.string().min(1, "Number of guests is required"),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RSVPForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { submitRsvp, isLoading } = useSupabase();
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      guests: '',
      dietary: '',
      message: '',
    },
  });
  
  // Generate participation badge
  const generateBadge = (name: string) => {
    // List of possible badge titles
    const badgeTitles = [
      "Early Bird", 
      "Party Enthusiast", 
      "Celebration VIP", 
      "Special Guest", 
      "Friend of Honor",
      "PR Celebration Star",
      "Grand Guest",
      "Celebration Royalty"
    ];
    
    // Randomly select a badge title using a hash of the name + timestamp for consistency
    const nameHash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const badgeIndex = nameHash % badgeTitles.length;
    const badgeTitle = badgeTitles[badgeIndex];
    
    // Generate a color based on the name hash
    const hue = (nameHash * 37) % 360;
    const badgeColor = `hsl(${hue}, 80%, 45%)`;
    
    return {
      title: badgeTitle,
      color: badgeColor,
      earned: new Date().toISOString(),
    };
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Generate participation badge
      const badge = generateBadge(data.fullName);
      
      // Store RSVP in localStorage with badge
      const rsvpData = {
        id: Date.now(), // Use timestamp as ID
        ...data,
        badge,
        createdAt: new Date().toISOString()
      };
      
      const existingRsvps = localStorage.getItem('pr_party_rsvps');
      const rsvps = existingRsvps ? JSON.parse(existingRsvps) : [];
      rsvps.push(rsvpData);
      localStorage.setItem('pr_party_rsvps', JSON.stringify(rsvps));
      
      // Save badge to separate storage for easy access
      const userBadges = localStorage.getItem('pr_party_badges') || '{}';
      const badges = JSON.parse(userBadges);
      badges[data.fullName] = badge;
      localStorage.setItem('pr_party_badges', JSON.stringify(badges));
      
      // Also try API
      try {
        await submitRsvp(data);
      } catch (apiError) {
        console.error('API RSVP submission error:', apiError);
        // Continue even if API fails
      }
      
      setFormSubmitted(true);
      setShowConfetti(true);
      
      // Reset confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error('RSVP submission error:', error);
    }
  };
  
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
    <section id="rsvp" className="py-16 px-4 relative bg-gradient-to-b from-softWhite to-softPink/30">
      {showConfetti && <Confetti />}
      
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold relative inline-block">
              <span className="relative z-10">RSVP</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-softPink opacity-50 z-0"></span>
            </h2>
            <p className="text-lg mt-4 text-charcoal/70">We look forward to celebrating with you!</p>
          </motion.div>
          
          <motion.div 
            className="rounded-2xl p-8 md:p-10 shadow-lg bg-white/15 backdrop-blur-md border border-white/20"
            variants={itemVariants}
          >
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-dancing text-sparkleGold mb-2">Thank You!</h3>
                <p className="text-lg text-charcoal/80 mb-4">
                  Your RSVP has been successfully submitted. We look forward to celebrating with you!
                </p>
                
                {/* Display earned participation badge */}
                <div className="mt-6 mb-4">
                  <h4 className="text-lg font-semibold mb-2">You've earned a participation badge!</h4>
                  
                  {(() => {
                    // Get the badge data
                    const badgeData = (() => {
                      try {
                        const userBadges = localStorage.getItem('pr_party_badges');
                        if (!userBadges) return null;
                        
                        const badges = JSON.parse(userBadges);
                        const name = form.getValues().fullName;
                        return badges[name];
                      } catch (e) {
                        return null;
                      }
                    })();
                    
                    if (!badgeData) return null;
                    
                    return (
                      <div 
                        className="inline-block py-3 px-6 rounded-lg shadow-md border-2"
                        style={{ 
                          backgroundColor: `${badgeData.color}20`, 
                          borderColor: badgeData.color 
                        }}
                      >
                        <div 
                          className="font-bold text-xl mb-1" 
                          style={{ color: badgeData.color }}
                        >
                          {badgeData.title}
                        </div>
                        <div className="text-sm opacity-80">Earned {new Date(badgeData.earned).toLocaleDateString()}</div>
                      </div>
                    );
                  })()} 
                </div>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-charcoal">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              className="w-full px-4 py-3 rounded-lg border border-champagneGold/30 focus:ring-2 focus:ring-champagneGold bg-white/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-charcoal">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your phone number" 
                              className="w-full px-4 py-3 rounded-lg border border-champagneGold/30 focus:ring-2 focus:ring-champagneGold bg-white/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-charcoal">Number of Guests</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-champagneGold/30 focus:ring-2 focus:ring-champagneGold bg-white/80">
                                <SelectValue placeholder="Select number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dietary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-charcoal">Dietary Restrictions</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="If any" 
                              className="w-full px-4 py-3 rounded-lg border border-champagneGold/30 focus:ring-2 focus:ring-champagneGold bg-white/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-charcoal">Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your wishes or any message for Tejinder..." 
                            className="w-full px-4 py-3 rounded-lg border border-champagneGold/30 focus:ring-2 focus:ring-champagneGold bg-white/80 resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-center pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-champagneGold hover:bg-sparkleGold text-white px-8 py-6 rounded-full text-lg font-medium transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 h-auto"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                          Submitting...
                        </>
                      ) : (
                        "Count Me In 🎉"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
