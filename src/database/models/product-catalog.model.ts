/**
 * ProductCatalog Model
 * 
 * Represents a catalog of products extracted from digital sources
 */

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  images?: string[];
  price?: {
    amount?: number;
    currency?: string;
    range?: {
      min: number;
      max: number;
    };
  };
  category?: string;
  subcategory?: string;
  hsCode?: string;
  attributes: Record<string, any>;
  marketplaceListing?: {
    platform: string;
    url: string;
    externalId?: string;
  }[];
  exportPotential?: {
    score: number;
    targetMarkets: string[];
    requirements: string[];
  };
  confidenceScore: number;
  extractionSources: string[]; // IDs of extraction results where this product was found
  createdAt: Date;
  updatedAt: Date;
}

export class ProductModel {
  // In a real implementation, this would connect to a database
  // For now, we'll use in-memory storage for demonstration
  private static products: Product[] = [];
  
  /**
   * Create a new product
   */
  static async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.products.push(newProduct);
    return newProduct;
  }
  
  /**
   * Find a product by ID
   */
  static async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }
  
  /**
   * Update a product by ID
   */
  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedProduct = {
      ...this.products[index],
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    this.products[index] = updatedProduct;
    return updatedProduct;
  }
  
  /**
   * List products by business ID
   */
  static async listByBusinessId(businessId: string, limit: number = 10, offset: number = 0): Promise<Product[]> {
    return this.products
      .filter(p => p.businessId === businessId)
      .slice(offset, offset + limit);
  }
  
  /**
   * Delete a product by ID
   */
  static async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLength;
  }
  
  /**
   * Search products by criteria
   */
  static async search(criteria: {
    businessId?: string;
    category?: string;
    hsCode?: string;
    minConfidence?: number;
  }, limit: number = 10, offset: number = 0): Promise<Product[]> {
    let results = this.products;
    
    if (criteria.businessId) {
      results = results.filter(p => p.businessId === criteria.businessId);
    }
    
    if (criteria.category) {
      results = results.filter(p => p.category === criteria.category);
    }
    
    if (criteria.hsCode) {
      results = results.filter(p => p.hsCode === criteria.hsCode);
    }
    
    if (typeof criteria.minConfidence === 'number') {
      results = results.filter(p => p.confidenceScore >= criteria.minConfidence);
    }
    
    return results.slice(offset, offset + limit);
  }
} 