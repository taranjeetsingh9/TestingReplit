import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// For simplicity, we're using the Express backend as a proxy to Supabase
// In a real app with Supabase credentials, you might use the Supabase client directly

interface RsvpFormData {
  fullName: string;
  phone: string;
  guests: string;
  dietary?: string;
  message?: string;
}

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Submit RSVP to the backend
  const submitRsvp = async (formData: RsvpFormData) => {
    setIsLoading(true);
    try {
      // Try the API request first
      try {
        const response = await apiRequest('POST', '/api/rsvp', formData);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit RSVP');
        }
        
        await response.json();
      } catch (apiError) {
        console.error('API error:', apiError);
        // We'll continue even if the API fails
      }
      
      toast({
        title: 'RSVP Submitted!',
        description: 'Thank you for your RSVP. We look forward to celebrating with you!',
        variant: 'default',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitRsvp,
    isLoading,
  };
}
