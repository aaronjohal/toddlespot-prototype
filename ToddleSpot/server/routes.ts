import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema, insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // User registration
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  // Login user (simple implementation - in production, use proper auth)
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  // Get current user (simplified - in production, use auth middleware)
  app.get("/api/user", async (req: Request, res: Response) => {
    // Mock user lookup based on session/token
    // In a real app, you'd get the user ID from the auth middleware
    const userId = 1; // Mock user ID
    
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Get venues
  app.get("/api/venues", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const type = req.query.type as string | undefined;
      
      let venues;
      
      if (type) {
        venues = await storage.getVenuesByType(type);
      } else {
        venues = await storage.getVenues(limit, offset);
      }
      
      res.status(200).json(venues);
    } catch (error) {
      res.status(500).json({ message: "Error fetching venues" });
    }
  });

  // Get venues by location
  app.get("/api/venues/nearby", async (req: Request, res: Response) => {
    try {
      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 5; // Default 5km
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Valid latitude and longitude are required" });
      }
      
      const venues = await storage.getVenuesByLocation({ latitude, longitude }, radius);
      res.status(200).json(venues);
    } catch (error) {
      res.status(500).json({ message: "Error fetching nearby venues" });
    }
  });

  // Get single venue
  app.get("/api/venues/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const venue = await storage.getVenue(id);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.status(200).json(venue);
    } catch (error) {
      res.status(500).json({ message: "Error fetching venue" });
    }
  });

  // Get reviews for a venue
  app.get("/api/venues/:id/reviews", async (req: Request, res: Response) => {
    try {
      const venueId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByVenue(venueId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  // Create a review
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating review" });
      }
    }
  });

  // Get offers
  app.get("/api/offers", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const type = req.query.type as string | undefined;
      
      let offers;
      
      if (type) {
        offers = await storage.getOffersByType(type);
      } else {
        offers = await storage.getOffers(limit, offset);
      }
      
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching offers" });
    }
  });

  // Get featured offers
  app.get("/api/offers/featured", async (req: Request, res: Response) => {
    try {
      const featuredOffers = await storage.getFeaturedOffers();
      res.status(200).json(featuredOffers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured offers" });
    }
  });

  // Get user favorites
  app.get("/api/favorites", async (req: Request, res: Response) => {
    try {
      // In a real app, you'd get the user ID from the auth middleware
      const userId = 1; // Mock user ID
      
      const favorites = await storage.getFavoritesByUser(userId);
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  // Add favorite
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error adding favorite" });
      }
    }
  });

  // Remove favorite
  app.delete("/api/favorites/:venueId", async (req: Request, res: Response) => {
    try {
      // In a real app, you'd get the user ID from the auth middleware
      const userId = 1; // Mock user ID
      const venueId = parseInt(req.params.venueId);
      
      const success = await storage.removeFavorite(userId, venueId);
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
