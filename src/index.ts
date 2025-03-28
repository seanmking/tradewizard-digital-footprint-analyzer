import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { extractorRoutes } from './routes/extractor-routes';
import websiteAnalysisRoutes from './routes/website-analysis';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Increased limit for larger payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/extract', extractorRoutes);
app.use('/api/website-analysis', websiteAnalysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    version: '1.0.0',
    extractionEngine: 'LLM-first'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`TradeWizard Digital Footprint Analyzer running on port ${port}`);
  logger.info(`Using LLM-first extraction as default strategy`);
});
