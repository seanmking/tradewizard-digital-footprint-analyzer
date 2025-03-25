# Cursor Implementation Prompt: TradeWizard Business Digital Footprint Analyzer

## Context

TradeWizard is an AI-powered platform helping South African SMEs successfully navigate international exports. A critical component of this platform is the Business Digital Footprint Analyzer, which extracts business and product information from SME websites, social media, and other digital content.

This prompt outlines the implementation tasks for building the Business Digital Footprint Analyzer, adhering to the three-layer architecture (AI Agent, MCP, Database) of TradeWizard.

## Your Task

Implement the Business Digital Footprint Analyzer as outlined in the IMPLEMENTATION_PLAN.md document. Focus on creating a system that can:

1. Extract business information from websites and social media
2. Identify and classify products
3. Generate structured business profiles
4. Integrate with MCPs for enhanced intelligence
5. Provide confidence scoring for extracted information

## Implementation Approach

### Phase 1.1: Core Website Extraction System

Start by implementing the core website extraction system with the following components:

1. **Website Scraper Service**
   - Build a service that can scrape website content using Puppeteer/Cheerio
   - Implement DOM traversal for identifying business information and products
   - Create a standardized extraction schema

2. **Entity Extraction**
   - Implement basic entity recognition for identifying:
     - Business name, description, location
     - Product names, descriptions, categories
     - Contact information
   - Create confidence scoring for each extracted entity

3. **Business Profile Generator**
   - Build a service that transforms extracted entities into a structured business profile
   - Implement schema validation for business profiles
   - Create a simple export readiness pre-assessment based on extracted data

4. **Multi-Link Input UI**
   - Create a user interface for inputting website URLs
   - Implement a processing visualization component
   - Build a simple verification interface for reviewing extracted information

### Repository Setup and Structure

1. Set up the project structure according to the directory layout in IMPLEMENTATION_PLAN.md
2. Configure TypeScript, ESLint, and testing frameworks
3. Create the basic React application structure for the frontend components
4. Set up the backend API structure with Express.js

### Specific Implementation Tasks

#### Task 1: Website Scraper Service

1. Create a `WebsiteExtractor` class that:
   - Takes a URL as input
   - Uses Puppeteer/Cheerio to fetch and parse the website
   - Extracts key business information using DOM traversal
   - Identifies product listings and their details
   - Returns a standardized extraction result with confidence scores

2. Implement techniques for different website structures:
   - E-commerce sites (product listings, categories)
   - Business sites (about pages, contact information)
   - Portfolio sites (project showcases, service descriptions)

3. Add error handling, retries, and timeout management

#### Task 2: Entity Processor

1. Create an `EntityProcessor` class that:
   - Takes the raw extraction result
   - Identifies and classifies entities (business info, products, etc.)
   - Applies confidence scoring to extracted entities
   - Normalizes data formats (dates, phone numbers, etc.)
   - Returns processed entities ready for profile generation

2. Implement specific entity extractors for:
   - Business information (name, description, founded date, etc.)
   - Product details (name, description, price, specifications)
   - Location information (address, service areas, etc.)
   - Contact details (email, phone, social media handles)

#### Task 3: Business Profile Generator

1. Create a `BusinessProfileGenerator` class that:
   - Takes processed entities as input
   - Generates a structured business profile
   - Identifies information gaps
   - Calculates initial export readiness scores
   - Prepares the profile for MCP integration

2. Implement a database model and repository for storing business profiles.

#### Task 4: Frontend Components

1. Implement the `MultiLinkCollector` component that:
   - Provides an intuitive interface for entering website URLs
   - Validates URLs before submission
   - Shows input state and error handling

2. Create the `ProcessingVisualization` component that:
   - Shows real-time extraction progress
   - Visualizes discovered entities as they are extracted
   - Provides feedback on the extraction process

3. Build the `BusinessVerification` component that:
   - Displays extracted information in a clear, structured format
   - Allows users to confirm, edit, or reject extracted entities
   - Highlights confidence levels for each piece of information
   - Provides simple forms for adding missing information

4. Implement the `DiscoveryMeter` component that:
   - Shows overall completeness of the business profile
   - Indicates which areas have sufficient information
   - Suggests additional sources for missing information

#### Task 5: API Endpoints

1. Create the following API endpoints:
   - `POST /api/analyze-website` - Submit a website URL for analysis
   - `GET /api/extraction-status/:id` - Check the status of an extraction
   - `GET /api/business-profile/:id` - Get the generated business profile
   - `PUT /api/business-profile/:id` - Update a business profile with user corrections
   - `POST /api/verify-entities` - Submit entity verifications

2. Implement proper error handling, validation, and authentication for all endpoints.

#### Task 6: MCP Integration Foundation

1. Create a basic integration layer for communicating with MCPs:
   - Design interfaces for MCP queries
   - Implement query formatters for each MCP
   - Create response handlers for MCP responses

2. Focus on the Compliance MCP integration first:
   - Map extracted products to HS codes
   - Query compliance requirements for identified products
   - Enhance the business profile with compliance insights

### Testing Approach

1. Create unit tests for all core classes and functions
2. Implement integration tests for API endpoints
3. Create test fixtures for website content extraction
4. Set up end-to-end tests for the full extraction flow

### Documentation Requirements

1. Add comprehensive JSDoc comments to all classes and functions
2. Create a user guide for the multi-link collector interface
3. Document the business profile schema and confidence scoring system
4. Create an integration guide for connecting with MCPs

## Technical Specifications

### Backend Technologies

- **Node.js** with TypeScript
- **Express.js** for API endpoints
- **Puppeteer/Cheerio** for website scraping
- **spaCy/NLP.js** for entity extraction
- **Jest** for testing
- **Supabase** for database

### Frontend Technologies

- **React** with TypeScript
- **shadcn/ui** for UI components
- **TailwindCSS** for styling
- **React Query** for data fetching
- **Framer Motion** for animations

### Architecture Guidelines

1. **AI Agent Layer Responsibilities**:
   - Orchestrate the extraction process
   - Perform entity recognition and classification
   - Generate confidence scores
   - Maintain context of user's business profile

2. **MCP Layer Responsibilities**:
   - Provide compliance requirements for extracted products
   - Supply market intelligence for identified business sectors
   - Offer logistics insights based on business location and product types

3. **Database Layer Responsibilities**:
   - Store business profiles and extracted entities
   - Maintain user verification status for entities
   - Track extraction history and confidence scores
   - Cache extraction results for performance

### Data Models

1. **Extraction Result**:
   ```typescript
   interface ExtractionResult {
     id: string;
     sourceUrl: string;
     sourceType: 'website' | 'instagram' | 'facebook' | 'document';
     rawContent: string;
     extractedEntities: ExtractedEntity[];
     confidence: number;
     processingTime: number;
     status: 'pending' | 'processing' | 'completed' | 'failed';
     error?: string;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **Extracted Entity**:
   ```typescript
   interface ExtractedEntity {
     id: string;
     type: 'business' | 'product' | 'location' | 'contact';
     name: string;
     value: any;
     confidence: number;
     source: string;
     verified: boolean;
     userModified: boolean;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

3. **Business Profile**:
   ```typescript
   interface BusinessProfile {
     id: string;
     userId: string;
     businessName: string;
     description: string;
     industry: string;
     foundedYear?: number;
     employeeCount?: number;
     locations: Location[];
     products: Product[];
     contactInformation: ContactInformation;
     socialProfiles: SocialProfile[];
     exportReadiness: {
       score: number;
       areas: {
         compliance: number;
         market: number;
         operations: number;
       };
     };
     confidence: number;
     sources: string[];
     verified: boolean;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

## Evaluation Criteria

Your implementation will be evaluated based on:

1. **Architectural Alignment**: How well it follows the three-layer architecture
2. **Extraction Accuracy**: How effectively it identifies business information and products
3. **Code Quality**: Clarity, maintainability, and testability of the code
4. **User Experience**: Intuitiveness and responsiveness of the frontend interface
5. **Performance**: Efficiency of the extraction process and API endpoints
6. **MCP Integration**: Effectiveness of integration with the broader TradeWizard system

## Deliverables

1. Fully implemented Website Extractor Service
2. Entity Processor with confidence scoring
3. Business Profile Generator
4. Frontend components for multi-link collection and verification
5. API endpoints for extraction and profile management
6. Basic MCP integration for compliance insights
7. Comprehensive test suite
8. Documentation

## Timeline

The implementation should be divided into the following milestones:

1. **Setup & Foundation** (3 days)
   - Project structure
   - Dependencies
   - Basic API endpoints

2. **Core Extraction System** (5 days)
   - Website scraper service
   - Entity processor
   - Business profile generator

3. **Frontend Components** (4 days)
   - Multi-link collector
   - Processing visualization
   - Verification interface

4. **Integration & Testing** (3 days)
   - MCP integration
   - End-to-end testing
   - Performance optimization

5. **Documentation & Finalization** (2 days)
   - JSDoc comments
   - User guides
   - Final testing and review

## Getting Started

1. Clone the repository
2. Install dependencies
3. Review the IMPLEMENTATION_PLAN.md document for detailed architecture
4. Start with setting up the project structure and dependencies
5. Implement the website scraper service as the foundation

## Additional Resources

- TradeWizard's MCP API documentation
- shadcn/ui component library documentation
- Puppeteer/Cheerio documentation
- spaCy/NLP.js documentation
- Supabase documentation

## Conclusion

The Business Digital Footprint Analyzer is a critical component of TradeWizard that will significantly enhance the user experience by automating the extraction of business information. This implementation should focus on delivering immediate value to users while setting a foundation for more advanced features in subsequent phases.
