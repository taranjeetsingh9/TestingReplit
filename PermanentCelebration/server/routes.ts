import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, rsvpValidationSchema, insertMemorySchema, memoryValidationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Create RSVP
  app.post("/api/rsvp", async (req, res) => {
    try {
      // Validate request body
      const validationResult = rsvpValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid RSVP data", 
          errors: validationResult.error.format() 
        });
      }

      // Parse the incoming data to match our schema
      const rsvpData = insertRsvpSchema.parse({
        fullName: req.body.fullName,
        phone: req.body.phone,
        guests: parseInt(req.body.guests),
        dietary: req.body.dietary || "",
        message: req.body.message || "",
      });

      // Save RSVP to storage
      const savedRsvp = await storage.createRsvp(rsvpData);
      return res.status(201).json(savedRsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      return res.status(500).json({ message: "Failed to create RSVP" });
    }
  });

  // Get all RSVPs
  app.get("/api/rsvps", async (req, res) => {
    try {
      const rsvps = await storage.getRsvps();
      return res.status(200).json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  // Create Memory
  app.post("/api/memories", async (req, res) => {
    try {
      // Validate request body
      const validationResult = memoryValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid memory data", 
          errors: validationResult.error.format() 
        });
      }

      // Parse the incoming data to match our schema
      const memoryData = insertMemorySchema.parse({
        name: req.body.name,
        message: req.body.message,
        photo: req.body.photo === null || req.body.photo === undefined ? null : req.body.photo,
      });

      // Save memory to storage
      const savedMemory = await storage.createMemory(memoryData);
      return res.status(201).json(savedMemory);
    } catch (error) {
      console.error("Error creating memory:", error);
      return res.status(500).json({ message: "Failed to create memory" });
    }
  });

  // Get all Memories
  app.get("/api/memories", async (req, res) => {
    try {
      const memories = await storage.getMemories();
      return res.status(200).json(memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      return res.status(500).json({ message: "Failed to fetch memories" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
