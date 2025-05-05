import { type User, type InsertUser, type Rsvp, type InsertRsvp, type Memory, type InsertMemory } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvps(): Promise<Rsvp[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  getMemories(): Promise<Memory[]>;
}

// Import the Supabase storage implementation
import { SupabaseStorage } from './supabaseStorage.service';

// Create and export the storage instance using Supabase
export const storage = new SupabaseStorage();

