# TradeWizard Business Digital Footprint Analyzer
## Implementation Plan for Cursor

This document outlines the implementation plan for the Business Digital Footprint Analyzer component of TradeWizard. This system will analyze SME websites, social media profiles, and other digital content to automatically extract business and product information, accelerating the export readiness assessment process.

## Architecture Overview

The system will adhere to TradeWizard's established three-layer architecture:

1. **AI Agent Layer**: Orchestrates extraction, performs classification, and maintains context
2. **MCP Layer**: Provides specialized intelligence (compliance, market, operations)
3. **Database Layer**: Stores and manages extracted business profiles

## Implementation Goals

1. Create a system that extracts business and product information from multiple sources
2. Design an intuitive UI for collecting digital footprint links
3. Build a verification interface for reviewing and confirming extracted data
4. Integrate with MCPs to enhance extracted information with export insights
5. Develop a confidence scoring system for extracted information

## Phase 1 Implementation Breakdown

The implementation will be divided into three sub-phases:

### Phase 1.1 - Core Extraction System
- Website scraping (Puppeteer/Cheerio)
- Instagram parsing (basic)
- Business profile generation
- Simple verification UI

### Phase 1.2 - Enhanced Sources
- Facebook business page extraction
- Document/PDF upload and analysis
- Improved classification with HS codes
- Enhanced verification UI

### Phase 1.3 - Full Integration
- Marketplace integrations (Etsy)
- Multi-source entity resolution
- Complete MCP integration
- Advanced confidence scoring

## Technical Implementation Details

### 1. Multi-Source Extractor Service

The extractor service will be implemented as a modular system that can process different types of digital content:

#### 1.1 Website Scraper Module
- Use Puppeteer for JavaScript-heavy sites and Cheerio for static sites
- Extract business info (name, location, about, contact)
- Identify product listings, categories, and descriptions
- Parse metadata (business type, founding year, team size)

#### 1.2 Social Media Parser Module
- Instagram business profile parser:
  - Extract bio information, product photos, and captions
  - Analyze hashtags for product categorization
  - Identify business location and contact info
- Facebook business page parser:
  - Extract business details from About section
  - Identify products from Shop section if available
  - Analyze posts for product mentions

#### 1.3 Document Processor Module
- PDF catalog/brochure analyzer:
  - Extract product information from structured documents
  - Identify business details from company materials
  - Parse pricing and specification data

#### 1.4 Extraction Normalizer
- Convert all extracted data to standardized format
- Resolve conflicting information across sources
- Apply confidence scores to extracted entities

### 2. Business Intelligence Processor

The intelligence processor will analyze and enhance extracted raw data:

#### 2.1 Entity Extraction Pipeline
- Use spaCy for named entity recognition
- Identify business name, location, products, and key information
- Extract contact details and social proof (reviews, testimonials)

#### 2.2 Product Classification System
- Categorize products into industry taxonomies
- Map to HS codes for export classification
- Identify product features, materials, and specifications

#### 2.3 Confidence Scoring Algorithm
- Calculate confidence scores for each extracted entity
- Factor in source reliability and extraction quality
- Identify information gaps requiring user confirmation

#### 2.4 Business Profile Generator
- Create structured business profile from extracted data
- Generate initial export readiness assessment
- Prepare data for MCP integration

### 3. Multi-Link Collector UI

The frontend interface for collecting digital footprint links:

#### 3.1 Conversational Input Interface
- Design Sara-guided conversation flow for link collection
- Create intuitive UI with platform-specific input fields
- Implement auto-detection of social handles vs. URLs

#### 3.2 Link Type Detection
- Automatically identify input type (website, Instagram, Facebook, etc.)
- Validate links before processing
- Provide feedback on link validity

#### 3.3 Real-time Analysis Visualization
- Show processing status for each link
- Visualize data extraction in real-time
- Present immediate insights as information is discovered

#### 3.4 Discovery Meter & Progress Indicators
- Implement visual "discovery meter" showing information completeness
- Track progress across different business dimensions
- Show value increase with each additional source

### 4. Verification Interface

The interface for reviewing and confirming extracted information:

#### 4.1 Extracted Information Presentation
- Present discovered business information in structured cards
- Organize products into categories
- Show source attribution for each piece of information

#### 4.2 Confidence Indicators
- Visual indicators for confidence level of each extracted item
- Prioritize low-confidence items for verification
- Explain confidence assessment to users

#### 4.3 Edit/Confirm Functionality
- Allow users to correct, confirm, or reject extracted information
- Provide streamlined editing interface for modifications
- Implement batch confirmation for high-confidence items

#### 4.4 Missing Information Highlighter
- Identify critical information gaps
- Provide simple forms for adding missing details
- Suggest additional sources that might contain missing information

### 5. MCP Integration Layer

The system to connect extracted profiles with MCP intelligence:

#### 5.1 API Endpoints for MCP Data Exchange
- Create standardized endpoints for MCP queries
- Implement request formatting for each MCP
- Handle response parsing and integration

#### 5.2 Business Profile to MCP Query Formatter
- Transform business profile into MCP-specific queries
- Apply business rules for query optimization
- Handle rate limiting and priority queuing

#### 5.3 Response Handlers for MCP Insights
- Process and integrate MCP responses
- Enhance business profile with MCP insights
- Apply confidence scoring to MCP-provided information

#### 5.4 Real-time Integration Hooks
- Implement event-driven updates when business profile changes
- Create webhooks for MCP notification
- Design fallback mechanisms for MCP unavailability

## Directory Structure

```
src/
├── ai-agent/
│   ├── extractors/
│   │   ├── website-extractor.ts
│   │   ├── instagram-extractor.ts
│   │   ├── facebook-extractor.ts
│   │   └── document-extractor.ts
│   ├── processors/
│   │   ├── entity-processor.ts
│   │   ├── product-classifier.ts
│   │   └── confidence-scorer.ts
│   ├── generators/
│   │   ├── business-profile-generator.ts
│   │   ├── product-catalog-generator.ts
│   │   └── readiness-assessment-generator.ts
│   └── services/
│       ├── extraction-service.ts
│       ├── intelligence-service.ts
│       └── integration-service.ts
├── mcp/
│   ├── compliance-mcp/
│   │   ├── product-compliance-mapper.ts
│   │   └── certification-recommender.ts
│   ├── market-intelligence-mcp/
│   │   ├── market-opportunity-matcher.ts
│   │   └── competitor-analyzer.ts
│   └── export-operations-mcp/
│       ├── logistics-recommender.ts
│       └── cost-estimator.ts
├── database/
│   ├── models/
│   │   ├── business-profile.model.ts
│   │   ├── product-catalog.model.ts
│   │   └── extraction-result.model.ts
│   ├── repositories/
│   │   ├── business-profile.repository.ts
│   │   ├── product-catalog.repository.ts
│   │   └── extraction-result.repository.ts
│   └── services/
│       ├── business-profile.service.ts
│       └── product-catalog.service.ts
├── components/
│   ├── digital-footprint/
│   │   ├── MultiLinkCollector.tsx
│   │   ├── ProcessingVisualization.tsx
│   │   ├── DiscoveryMeter.tsx
│   │   └── PlatformInputs/
│   │       ├── WebsiteInput.tsx
│   │       ├── InstagramInput.tsx
│   │       ├── FacebookInput.tsx
│   │       └── DocumentUploader.tsx
│   ├── verification/
│   │   ├── BusinessInfoCard.tsx
│   │   ├── ProductCatalogCard.tsx
│   │   ├── ConfidenceIndicator.tsx
│   │   └── EditableField.tsx
│   └── shared/
│       ├── ProgressBar.tsx
│       ├── ConfidenceBadge.tsx
│       └── SourceAttribution.tsx
└── pages/
    ├── digital-footprint-analyzer.tsx
    ├── business-verification.tsx
    └── export-readiness-summary.tsx
```

## Implementation Steps and Tasks

### Step 1: Set Up Project Structure

1. Create the directory structure as outlined above
2. Set up required dependencies in package.json
3. Configure build and development environment
4. Set up testing framework

### Step 2: Implement Core Extraction Services

1. Build website scraper module:
   - Implement Puppeteer/Cheerio integration
   - Create DOM traversal system for identifying key elements
   - Build metadata extraction functions
   - Implement product detection algorithms

2. Develop Instagram parser module:
   - Create Instagram profile analyzer
   - Build caption and hashtag processor
   - Implement image metadata extractor
   - Create follower/engagement analyzer

3. Build extraction normalizer:
   - Create standardized data schema
   - Implement conflict resolution logic
   - Build confidence scoring system
   - Create extraction result caching

### Step 3: Develop Business Intelligence Processor

1. Implement entity extraction pipeline:
   - Integrate spaCy for entity recognition
   - Build business entity identification system
   - Create product entity extractor
   - Implement location and contact detail parser

2. Create product classification system:
   - Build product category mapper
   - Implement HS code prediction system
   - Create product feature extractor
   - Develop product relation mapper

3. Implement business profile generator:
   - Create profile schema and builder
   - Implement gap identification logic
   - Build profile enhancement system
   - Create export readiness pre-assessment

### Step 4: Build Frontend Components

1. Develop multi-link collector UI:
   - Create conversational interface for link collection
   - Build platform-specific input components
   - Implement real-time feedback system
   - Create discovery meter and progress visualization

2. Build verification interface:
   - Create business information card components
   - Build product catalog visualization
   - Implement confidence indicator system
   - Create editable field components for corrections

3. Implement results dashboard:
   - Build business profile visualization
   - Create product catalog display
   - Implement readiness assessment summary
   - Build next-steps recommendation component

### Step 5: Implement MCP Integration

1. Create MCP API integration layer:
   - Build standardized API client for MCPs
   - Implement query formatters for each MCP
   - Create response handlers for each MCP
   - Implement error handling and fallbacks

2. Develop business profile enhancers:
   - Build compliance enhancer using Compliance MCP
   - Create market opportunity enhancer using Market Intelligence MCP
   - Implement logistics enhancer using Export Operations MCP
   - Build integrated profile with all MCP insights

### Step 6: Testing and Optimization

1. Create comprehensive test suite:
   - Unit tests for each module
   - Integration tests for component interactions
   - End-to-end tests for user flows
   - Performance tests for extraction services

2. Implement optimization strategies:
   - Extraction caching for common sites
   - Parallel processing for multiple sources
   - Intelligent rate limiting for social media APIs
   - Progressive rendering for UI components

## Integration with Existing TradeWizard Codebase

The Business Digital Footprint Analyzer will integrate with the existing TradeWizard codebase in the following ways:

1. **AI Agent Integration**:
   - The digital footprint analyzer will be a core component of the AI Agent layer
   - It will provide business profiles that Sarah (the AI agent) can use for personalized guidance
   - The confidence scoring will inform Sarah's conversational strategy

2. **MCP Integration**:
   - Extracted business profiles will be formatted for MCP consumption
   - MCP responses will enhance the business profile
   - Real-time updates will be synchronized across systems

3. **Database Integration**:
   - Business profiles will be stored in the existing database structure
   - User accounts will be linked to business profiles
   - Extraction history will be maintained for audit and improvement

4. **UI Integration**:
   - The multi-link collector will be integrated into the onboarding flow
   - The verification interface will use the existing design system
   - The results dashboard will be incorporated into the main TradeWizard interface

## Expected Outcomes and Deliverables

Upon completion of this implementation, the Business Digital Footprint Analyzer will:

1. Automatically extract business and product information from multiple digital sources
2. Provide a user-friendly interface for collecting and verifying digital footprint data
3. Generate structured business profiles with confidence scores
4. Integrate with MCPs to enhance profiles with export-specific insights
5. Accelerate the export readiness assessment process by reducing manual data entry
6. Provide a foundation for personalized export guidance based on actual business data

## Technical Requirements and Dependencies

- **Node.js**: v16 or higher
- **Puppeteer/Playwright**: For web scraping
- **Cheerio**: For HTML parsing
- **spaCy/NLP.js**: For entity extraction and NLP
- **React**: For frontend components
- **Supabase**: For database storage
- **Redis**: For caching (optional)
- **TypeScript**: For type safety and code quality
- **Jest**: For testing
- **Docker**: For containerization and deployment

## Conclusion

The Business Digital Footprint Analyzer will significantly enhance TradeWizard's ability to understand and assist SMEs in their export journey. By automating the extraction and analysis of business information, we'll reduce friction, accelerate onboarding, and enable more personalized guidance from the first interaction.

This implementation plan provides a comprehensive roadmap for building this system in a way that adheres to TradeWizard's architectural principles while delivering immediate value to users.
