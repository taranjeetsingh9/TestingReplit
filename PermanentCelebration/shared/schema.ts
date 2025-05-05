import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// RSVP schema
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  guests: integer("guests").notNull(),
  dietary: text("dietary"),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).pick({
  fullName: true,
  phone: true,
  guests: true,
  dietary: true,
  message: true,
});

export const rsvpValidationSchema = insertRsvpSchema.extend({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone number is required"),
  guests: z.string().min(1, "Number of guests is required"),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

// Memories schema
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  photo: text("photo"),
  createdAt: text("created_at").notNull(),
});

export const insertMemorySchema = createInsertSchema(memories).pick({
  name: true,
  message: true,
  photo: true,
});

export const memoryValidationSchema = insertMemorySchema.extend({
  name: z.string().min(2, "Name is required"),
  message: z.string().min(1, "Message is required"),
  photo: z.string().nullable().optional(),
});

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;
