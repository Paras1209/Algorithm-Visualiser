// Vercel serverless function for API routes
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes from your server
const handler = async (req, res) => {
  // Ensure req and res are properly initialized
  await registerRoutes(app);
  
  // Handle the actual request - this will route to your Express routes
  return app(req, res);
};

export default handler;