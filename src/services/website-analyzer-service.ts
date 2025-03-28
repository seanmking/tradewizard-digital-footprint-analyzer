/**
 * WebsiteAnalyzerService
 * 
 * Service responsible for analyzing business websites to extract
 * business information and products. This service uses the website extractor
 * factory to choose the appropriate extraction strategy.
 */

import { 
  ExtractionResult, 
  ExtractionStatus 
} from '@/types/extraction';
import { 
  WebsiteExtractorFactory, 
  ExtractionStrategy 
} from '@/ai-agent/extractors/website-extractor-factory';
import { IntelligenceService } from '@/ai-agent/services/intelligence-service';
import { logger } from '@/utils/logger';

export interface WebsiteAnalysisResult {
  id: string;
  url: string;
  businessInfo: any;
  products: any[];
  contacts: any[];
  locations: any[];
  status: ExtractionStatus;
  confidence: number;
  error?: string;
  processingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export class WebsiteAnalyzerService {
  private extractorFactory: WebsiteExtractorFactory;
  
  /**
   * Initialize the website analyzer service
   * 
   * @param intelligenceService - The intelligence service to use
   */
  constructor(intelligenceService: IntelligenceService) {
    this.extractorFactory = new WebsiteExtractorFactory(intelligenceService, {
      defaultStrategy: ExtractionStrategy.LLM_FIRST,
      llmConfig: {
        maxChunks: 5,
        maxTokensPerChunk: 8000,
        captureScreenshots: true,
        followInternalLinks: true,
        maxInternalLinks: 3,
        confidenceThreshold: 0.6
      }
    });
  }
  
  /**
   * Analyze a business website to extract information
   * 
   * @param url - The website URL to analyze
   * @param strategy - Optional extraction strategy to use
   * @returns Website analysis result
   */
  public async analyzeWebsite(url: string, strategy?: ExtractionStrategy): Promise<WebsiteAnalysisResult> {
    logger.info(`Starting website analysis for URL: ${url}`);
    
    try {
      // Use the extractor factory to extract data using the selected strategy
      const extractionResult = await this.extractorFactory.extract(url, strategy);
      
      // Transform the extraction result into a website analysis result
      return this.transformExtractionToAnalysis(extractionResult);
    } catch (error) {
      logger.error(`Error analyzing website ${url}: ${error}`);
      
      // Return failed analysis
      return {
        id: `analysis_${Date.now()}`,
        url,
        businessInfo: null,
        products: [],
        contacts: [],
        locations: [],
        status: 'failed',
        confidence: 0,
        error: error instanceof Error ? error.message : String(error),
        processingTime: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }
  
  /**
   * Transform an extraction result into a website analysis result
   * 
   * @param extraction - The extraction result to transform
   * @returns Website analysis result
   */
  private transformExtractionToAnalysis(extraction: ExtractionResult): WebsiteAnalysisResult {
    // Group entities by type
    const businesses = extraction.extractedEntities.filter(entity => entity.type === 'business');
    const products = extraction.extractedEntities.filter(entity => entity.type === 'product');
    const contacts = extraction.extractedEntities.filter(entity => entity.type === 'contact');
    const locations = extraction.extractedEntities.filter(entity => entity.type === 'location');
    
    // Get business info (taking the highest confidence business if multiple)
    let businessInfo = null;
    if (businesses.length > 0) {
      // Sort by confidence descending
      const sortedBusinesses = [...businesses].sort((a, b) => b.confidence - a.confidence);
      businessInfo = {
        name: sortedBusinesses[0].name,
        description: sortedBusinesses[0].attributes.description || '',
        businessType: sortedBusinesses[0].attributes.businessType || '',
        yearsInOperation: sortedBusinesses[0].attributes.yearsInOperation || '',
        confidence: sortedBusinesses[0].confidence
      };
    }
    
    // Transform products
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.attributes.description || '',
      price: product.attributes.price || '',
      category: product.attributes.category || '',
      specifications: product.attributes.specifications || {},
      url: product.attributes.url || extraction.sourceUrl,
      confidence: product.confidence
    }));
    
    // Transform contacts
    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      type: contact.attributes.contactType || 'unknown',
      value: contact.value,
      platform: contact.attributes.platform || '',
      confidence: contact.confidence
    }));
    
    // Transform locations
    const transformedLocations = locations.map(location => ({
      id: location.id,
      address: location.attributes.address || location.value,
      city: location.attributes.city || '',
      province: location.attributes.province || '',
      country: location.attributes.country || '',
      postalCode: location.attributes.postalCode || '',
      confidence: location.confidence
    }));
    
    return {
      id: `analysis_${Date.now()}`,
      url: extraction.sourceUrl,
      businessInfo,
      products: transformedProducts,
      contacts: transformedContacts,
      locations: transformedLocations,
      status: extraction.status,
      confidence: extraction.confidence,
      error: extraction.error,
      processingTime: extraction.processingTime,
      createdAt: extraction.createdAt,
      updatedAt: extraction.updatedAt
    };
  }
}