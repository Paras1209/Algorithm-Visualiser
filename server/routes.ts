import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAlgorithmCategorySchema, insertAlgorithmSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = '/api';

  // Get all algorithm categories
  app.get(`${apiPrefix}/algorithm-categories`, async (req, res) => {
    try {
      const categories = await storage.getAllAlgorithmCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching algorithm categories:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get a specific algorithm category by ID
  app.get(`${apiPrefix}/algorithm-categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const category = await storage.getAlgorithmCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching algorithm category:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Create a new algorithm category
  app.post(`${apiPrefix}/algorithm-categories`, async (req, res) => {
    try {
      const validatedData = insertAlgorithmCategorySchema.parse(req.body);
      const newCategory = await storage.createAlgorithmCategory(validatedData);
      return res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.format() });
      }
      console.error('Error creating algorithm category:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get all algorithms
  app.get(`${apiPrefix}/algorithms`, async (req, res) => {
    try {
      // Handle optional category query parameter
      const categoryId = req.query.categoryId 
        ? parseInt(req.query.categoryId as string) 
        : undefined;

      const algorithms = categoryId 
        ? await storage.getAlgorithmsByCategoryId(categoryId)
        : await storage.getAllAlgorithms();

      return res.status(200).json(algorithms);
    } catch (error) {
      console.error('Error fetching algorithms:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get a specific algorithm by ID
  app.get(`${apiPrefix}/algorithms/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const algorithm = await storage.getAlgorithmById(id);
      if (!algorithm) {
        return res.status(404).json({ message: 'Algorithm not found' });
      }

      return res.status(200).json(algorithm);
    } catch (error) {
      console.error('Error fetching algorithm:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Create a new algorithm
  app.post(`${apiPrefix}/algorithms`, async (req, res) => {
    try {
      const validatedData = insertAlgorithmSchema.parse(req.body);
      const newAlgorithm = await storage.createAlgorithm(validatedData);
      return res.status(201).json(newAlgorithm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.format() });
      }
      console.error('Error creating algorithm:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Simplified User Preferences API - No authentication for now
  // Get default user preferences
  app.get(`${apiPrefix}/user-preferences`, async (req, res) => {
    try {
      // Just return sample preferences for now
      return res.status(200).json({
        id: 1,
        userId: 1,
        animationSpeed: 3,
        arraySize: 20,
        theme: 'light',
        lastAlgorithmId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update user preferences
  app.patch(`${apiPrefix}/user-preferences`, async (req, res) => {
    try {
      const preferencesSchema = z.object({
        animationSpeed: z.number().min(1).max(5).optional(),
        arraySize: z.number().min(5).max(100).optional(),
        theme: z.string().optional(),
        lastAlgorithmId: z.number().optional(),
      });

      const validatedData = preferencesSchema.parse(req.body);
      
      // Just return the updated data for now
      return res.status(200).json({
        id: 1,
        userId: 1,
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.format() });
      }
      console.error('Error updating user preferences:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
