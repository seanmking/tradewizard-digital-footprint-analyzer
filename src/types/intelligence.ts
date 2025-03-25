/**
 * Type definitions for intelligence-related interfaces
 */

import { EntityType, ExtractionSource } from './extraction';

/**
 * Request format for content analysis
 */
export interface ContentAnalysisRequest {
  content: string;
  sourceUrl: string;
  sourceType: ExtractionSource;
  entityTypes: EntityType[];
  options?: ContentAnalysisOptions;
}

/**
 * Optional parameters for content analysis
 */
export interface ContentAnalysisOptions {
  confidenceThreshold?: number;
  maxEntities?: number;
  languageModel?: string;
  extractStructured?: boolean;
}

/**
 * Response format from content analysis
 */
export interface ContentAnalysisResponse {
  entities: AnalyzedEntity[];
  summary?: string;
  confidence: number;
  processingTime: number;
}

/**
 * An entity analyzed by the intelligence service
 */
export interface AnalyzedEntity {
  type: EntityType;
  name: string;
  attributes: Record<string, any>;
  rawText: string;
  confidence: number;
  contexts: TextContext[];
}

/**
 * Text context where an entity was found
 */
export interface TextContext {
  text: string;
  section?: string;
  page?: string;
  importance: number;
}

/**
 * Result of entity classification
 */
export interface ClassificationResult {
  entityId: string;
  classifications: EntityClassification[];
  confidence: number;
}

/**
 * Classification details for an entity
 */
export interface EntityClassification {
  category: string;
  subcategory?: string;
  code?: string;
  codeSystem?: string;
  confidence: number;
} 