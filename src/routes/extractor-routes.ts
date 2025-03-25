import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '../utils/logger';
import { WebsiteExtractor } from '../ai-agent/extractors/website-extractor';
import { IntelligenceService } from '../ai-agent/services/intelligence-service';

// Initialize the router
const router = Router();

// Initialize services
const intelligenceService = new IntelligenceService();
const websiteExtractor = new WebsiteExtractor(intelligenceService);

// Validate website URL
const validateWebsiteUrl = [
  body('url').isURL().withMessage('Please provide a valid URL')
];

// Website extraction endpoint
router.post('/website', validateWebsiteUrl, async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { url } = req.body;
    logger.info(`Starting website extraction for URL: ${url}`);
    
    // Extract data from website
    const result = await websiteExtractor.extract(url);
    
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in website extraction: ${error}`);
    return res.status(500).json({
      error: 'An error occurred during extraction',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Validate social media handle
const validateSocialHandle = [
  body('handle').isString().trim().notEmpty().withMessage('Please provide a valid handle')
];

// Instagram extraction endpoint (placeholder for now)
router.post('/instagram', validateSocialHandle, async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;
    logger.info(`Starting Instagram extraction for handle: ${handle}`);
    
    // Mock extraction for now
    const result = {
      id: `instagram-${Date.now()}`,
      sourceUrl: `https://instagram.com/${handle}`,
      sourceType: 'instagram',
      extractedEntities: [],
      confidence: 0.7,
      processingTime: 1200,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in Instagram extraction: ${error}`);
    return res.status(500).json({
      error: 'An error occurred during extraction',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Facebook extraction endpoint (placeholder for now)
router.post('/facebook', validateWebsiteUrl, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    logger.info(`Starting Facebook extraction for URL: ${url}`);
    
    // Mock extraction for now
    const result = {
      id: `facebook-${Date.now()}`,
      sourceUrl: url,
      sourceType: 'facebook',
      extractedEntities: [],
      confidence: 0.8,
      processingTime: 1500,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in Facebook extraction: ${error}`);
    return res.status(500).json({
      error: 'An error occurred during extraction',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Document upload validation
const validateDocument = [
  body('documentId').isString().trim().notEmpty().withMessage('Please provide a valid document ID')
];

// Document extraction endpoint (placeholder for now)
router.post('/document', validateDocument, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.body;
    logger.info(`Starting document extraction for ID: ${documentId}`);
    
    // Mock extraction for now
    const result = {
      id: `document-${Date.now()}`,
      sourceUrl: `document:${documentId}`,
      sourceType: 'document',
      extractedEntities: [],
      confidence: 0.9,
      processingTime: 2000,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error in document extraction: ${error}`);
    return res.status(500).json({
      error: 'An error occurred during extraction',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export const extractorRoutes = router; 