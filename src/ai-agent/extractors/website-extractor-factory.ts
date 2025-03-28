/**
 * WebsiteExtractorFactory
 * 
 * Factory class for creating website extractors with various approaches.
 * This factory provides a unified interface to choose between DOM-based or LLM-first
 * extraction strategies based on configuration or use case.
 */

import { WebsiteExtractor } from './website-extractor';
import { LLMWebsiteExtractor } from './llm-website-extractor';
import { IntelligenceService } from '@/ai-agent/services/intelligence-service';
import { ExtractionResult } from '@/types/extraction';
import { logger } from '@/utils/logger';

export enum ExtractionStrategy {
  DOM_BASED = 'dom-based',
  LLM_FIRST = 'llm-first'
}

interface WebsiteExtractorFactoryConfig {
  // Default extraction strategy to use
  defaultStrategy: ExtractionStrategy;
  
  // LLM extractor configuration
  llmConfig?: {
    maxChunks?: number;
    maxTokensPerChunk?: number;
    captureScreenshots?: boolean;
    followInternalLinks?: boolean;
    maxInternalLinks?: number;
    confidenceThreshold?: number;
  };
}

export class WebsiteExtractorFactory {
  private intelligenceService: IntelligenceService;
  private config: WebsiteExtractorFactoryConfig;
  
  /**
   * Initialize the website extractor factory
   * 
   * @param intelligenceService - The intelligence service to use
   * @param config - Factory configuration
   */
  constructor(
    intelligenceService: IntelligenceService,
    config?: Partial<WebsiteExtractorFactoryConfig>
  ) {
    this.intelligenceService = intelligenceService;
    
    // Default configuration 
    this.config = {
      defaultStrategy: ExtractionStrategy.LLM_FIRST,
      ...config
    };
  }
  
  /**
   * Get an extractor based on the strategy
   * 
   * @param strategy - The extraction strategy to use
   * @returns An extractor instance
   */
  public getExtractor(strategy?: ExtractionStrategy): WebsiteExtractor | LLMWebsiteExtractor {
    const selectedStrategy = strategy || this.config.defaultStrategy;
    
    logger.info(`Creating website extractor with strategy: ${selectedStrategy}`);
    
    if (selectedStrategy === ExtractionStrategy.LLM_FIRST) {
      return new LLMWebsiteExtractor(this.config.llmConfig);
    } else {
      return new WebsiteExtractor(this.intelligenceService);
    }
  }
  
  /**
   * Extract data from a URL using the specified or default strategy
   * 
   * @param url - The URL to extract from
   * @param strategy - Optional strategy override
   * @returns The extraction result
   */
  public async extract(url: string, strategy?: ExtractionStrategy): Promise<ExtractionResult> {
    const extractor = this.getExtractor(strategy);
    return await extractor.extract(url);
  }
}