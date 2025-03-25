/**
 * ExtractionResult Model
 * 
 * Represents the results of an extraction operation
 */

import { ExtractionResult } from '../../types/extraction';

export class ExtractionResultModel {
  // In a real implementation, this would connect to a database
  // For now, we'll use in-memory storage for demonstration
  private static results: ExtractionResult[] = [];
  
  /**
   * Save an extraction result
   */
  static async save(result: ExtractionResult): Promise<ExtractionResult> {
    // Check if result with the same ID exists
    const existingIndex = this.results.findIndex(r => r.id === result.id);
    
    if (existingIndex >= 0) {
      // Update existing result
      this.results[existingIndex] = {
        ...result,
        updatedAt: new Date()
      };
      return this.results[existingIndex];
    } else {
      // Add new result
      this.results.push(result);
      return result;
    }
  }
  
  /**
   * Find a result by ID
   */
  static async findById(id: string): Promise<ExtractionResult | null> {
    const result = this.results.find(r => r.id === id);
    return result || null;
  }
  
  /**
   * Find results by source URL
   */
  static async findBySourceUrl(url: string): Promise<ExtractionResult[]> {
    return this.results.filter(r => r.sourceUrl === url);
  }
  
  /**
   * Find results by source type
   */
  static async findBySourceType(sourceType: string): Promise<ExtractionResult[]> {
    return this.results.filter(r => r.sourceType === sourceType);
  }
  
  /**
   * List all results with optional pagination
   */
  static async list(limit: number = 10, offset: number = 0): Promise<ExtractionResult[]> {
    return this.results
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by createdAt desc
      .slice(offset, offset + limit);
  }
  
  /**
   * Delete a result by ID
   */
  static async delete(id: string): Promise<boolean> {
    const initialLength = this.results.length;
    this.results = this.results.filter(r => r.id !== id);
    return this.results.length < initialLength;
  }
  
  /**
   * Count results by status
   */
  static async countByStatus(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };
    
    this.results.forEach(result => {
      if (counts[result.status] !== undefined) {
        counts[result.status]++;
      }
    });
    
    return counts;
  }
  
  /**
   * Find results with high confidence
   */
  static async findHighConfidence(threshold: number = 0.8): Promise<ExtractionResult[]> {
    return this.results.filter(r => r.confidence >= threshold);
  }
} 