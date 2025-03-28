          productEntities.push({
            id: this.generateEntityId(),
            type: 'product',
            name: product.name,
            value: product.name,
            confidence: product.confidence,
            source: sourceUrl,
            verified: false,
            userModified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            attributes: {
              description: product.description || '',
              price: product.price || '',
              category: product.category || '',
              specifications: product.specifications || {},
              url: product.url || sourceUrl
            }
          });
        }
      });
      
      return productEntities;
    } catch (error) {
      logger.error(`Error parsing product extraction response: ${error}`);
      return [];
    }
  }
  
  /**
   * Call the AI model with a prompt
   * 
   * @param prompt - The prompt to send to the AI model
   * @returns The AI model's response
   */
  private async callAIModel(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.config.aiModel.url,
        {
          model: this.config.aiModel.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.aiModel.maxTokens,
          temperature: 0.1, // Low temperature for more deterministic outputs
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.aiModel.apiKey}`
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error(`Error calling AI model: ${error}`);
      throw new Error(`AI model call failed: ${error}`);
    }
  }
  
  /**
   * Generate a unique ID for an extraction
   * 
   * @returns A unique extraction ID
   */
  private generateExtractionId(): string {
    return 'ext_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Generate a unique ID for an entity
   * 
   * @returns A unique entity ID
   */
  private generateEntityId(): string {
    return 'ent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Calculate overall confidence score for a set of extracted entities
   * 
   * @param entities - The extracted entities
   * @returns Overall confidence score
   */
  private calculateOverallConfidence(entities: ExtractedEntity[]): number {
    if (entities.length === 0) {
      return 0;
    }
    
    // Calculate weighted average based on entity types
    const weights: Record<EntityType, number> = {
      'business': 0.4,
      'product': 0.3,
      'location': 0.2,
      'contact': 0.1,
      'person': 0.1,
      'service': 0.3
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    entities.forEach(entity => {
      const weight = weights[entity.type] || 0.1;
      weightedSum += entity.confidence * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
}