/**
 * Website Analysis API Routes
 * 
 * API endpoints for analyzing websites and extracting business information
 */

import express, { Request, Response } from 'express';
import { WebsiteAnalyzerService } from '@/services/website-analyzer-service';
import { IntelligenceService } from '@/ai-agent/services/intelligence-service';
import { ExtractionStrategy } from '@/ai-agent/extractors/website-extractor-factory';
import { isValidUrl } from '@/utils/validators';
import { logger } from '@/utils/logger';

const router = express.Router();

// Initialize services
const intelligenceService = new IntelligenceService();
const websiteAnalyzerService = new WebsiteAnalyzerService(intelligenceService);

/**
 * @route POST /api/website-analysis
 * @description Analyze a website URL to extract business information and products
 * @access Public
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { url, strategy } = req.body;
    
    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL provided'
      });
    }
    
    // Validate strategy if provided
    let extractionStrategy: ExtractionStrategy | undefined;
    if (strategy) {
      if (Object.values(ExtractionStrategy).includes(strategy as ExtractionStrategy)) {
        extractionStrategy = strategy as ExtractionStrategy;
      } else {
        return res.status(400).json({
          success: false,
          error: `Invalid extraction strategy. Valid options are: ${Object.values(ExtractionStrategy).join(', ')}`
        });
      }
    }
    
    logger.info(`Received website analysis request for URL: ${url}, strategy: ${extractionStrategy || 'default'}`);
    
    // Perform analysis
    const result = await websiteAnalyzerService.analyzeWebsite(url, extractionStrategy);
    
    // Return analysis result
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error processing website analysis request: ${error}`);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze website',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @route GET /api/website-analysis/status/:id
 * @description Get the status of a website analysis
 * @access Public
 */
router.get('/status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, we would look up the analysis by ID
    // For now, we return a mock response
    return res.json({
      success: true,
      data: {
        id,
        status: 'processing',
        progress: 0.5,
        message: 'Analysis in progress'
      }
    });
  } catch (error) {
    logger.error(`Error fetching analysis status: ${error}`);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis status',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;