import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { formatDate, formatTime } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Memory = {
  id: number;
  name: string;
  message: string;
  photo?: string;
  createdAt: string;
};

type Rsvp = {
  id: number;
  fullName: string;
  phone: string;
  guests: string;
  dietary?: string;
  message?: string;
  createdAt: string;
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState('memories');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [localMemories, setLocalMemories] = useState<Memory[]>([]);
  const [localRsvps, setLocalRsvps] = useState<Rsvp[]>([]);

  // Load stored data from localStorage
  useEffect(() => {
    const storedMemories = localStorage.getItem('pr_party_memories');
    const storedRsvps = localStorage.getItem('pr_party_rsvps');

    if (storedMemories) {
      try {
        setLocalMemories(JSON.parse(storedMemories));
      } catch (err) {
        console.error('Error parsing stored memories:', err);
      }
    }

    if (storedRsvps) {
      try {
        setLocalRsvps(JSON.parse(storedRsvps));
      } catch (err) {
        console.error('Error parsing stored RSVPs:', err);
      }
    }
  }, []);

  // Fetch memories and RSVPs
  const { data: apiMemories = [], isLoading: memoriesLoading } = useQuery<Memory[]>({
    queryKey: ['/api/memories'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: isAuthenticated
  });

  const { data: apiRsvps = [], isLoading: rsvpsLoading } = useQuery<Rsvp[]>({
    queryKey: ['/api/rsvp'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: isAuthenticated
  });
  
  // Combine local and API data
  const memories = [...localMemories, ...apiMemories.filter(m => !localMemories.some(sm => sm.id === m.id))];
  const rsvps = [...localRsvps, ...apiRsvps.filter(r => !localRsvps.some(sr => sr.id === r.id))];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if password matches - '98760' is the password
    if (password === '98760') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password, please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter password to view submitted memories and RSVPs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
                autoFocus
              />
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="mb-2 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main Page
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all submitted memories and RSVPs
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="memories">Memories</TabsTrigger>
          <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoriesLoading ? (
              <p className="col-span-full text-center">Loading memories...</p>
            ) : memories.length === 0 ? (
              <p className="col-span-full text-center">No memories submitted yet.</p>
            ) : (
              memories.map((memory: Memory) => (
                <Card key={memory.id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{memory.name}</CardTitle>
                    <CardDescription>{formatDate(memory.createdAt)} at {formatTime(memory.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="mb-4">{memory.message}</p>
                    {memory.photo && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedMemory(memory)}
                        className="w-full"
                      >
                        View Photo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rsvps" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rsvpsLoading ? (
              <p className="col-span-full text-center">Loading RSVPs...</p>
            ) : rsvps.length === 0 ? (
              <p className="col-span-full text-center">No RSVPs submitted yet.</p>
            ) : (
              rsvps.map((rsvp: Rsvp) => (
                <Card key={rsvp.id} className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{rsvp.fullName}</CardTitle>
                    <CardDescription>
                      {formatDate(rsvp.createdAt)} • {rsvp.guests} guests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <p><strong>Phone:</strong> {rsvp.phone}</p>
                      {rsvp.dietary && (
                        <p><strong>Dietary Restrictions:</strong> {rsvp.dietary}</p>
                      )}
                      {rsvp.message && (
                        <div>
                          <p className="font-semibold mb-1">Message:</p>
                          <p>{rsvp.message}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Photo modal */}
      <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedMemory?.name}'s Memory</DialogTitle>
            <DialogDescription>
              Shared on {selectedMemory && formatDate(selectedMemory.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedMemory?.photo && (
            <div className="flex justify-center">
              <img 
                src={selectedMemory.photo} 
                alt={`Memory shared by ${selectedMemory.name}`} 
                className="max-h-[70vh] object-contain rounded-md" 
              />
            </div>
          )}
          <p className="mt-4">{selectedMemory?.message}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
