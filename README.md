# Daddieshinor

Daddieshinor is a modern African technology publication exploring software, engineering, digital culture, and the systems shaping the continent.

The platform is built as a production-oriented content system rather than a simple blog, with a Next.js frontend, headless CMS integration, a dedicated subscriber API, analytics, media support, and SEO infrastructure.

## About

Daddieshinor combines:

- Technical essays and software engineering
- Architecture and engineering discipline
- Technology and digital culture
- African perspectives on technology

The platform is designed around performance, structured content, maintainability, and a deliberate editorial experience.

## Key Features

- Dynamic article routing with Next.js App Router
- Headless CMS integration for structured content management
- Dedicated FastAPI microservice for subscriber operations
- PostHog event analytics
- Dynamic category and content pages
- Embedded YouTube video essays
- Media-aware article experiences
- Ambient background audio support
- Dark mode
- Responsive, component-driven UI
- SEO metadata, sitemap, and robots configuration
- Error handling and loading states across content flows

## Architecture

Daddieshinor uses a decoupled architecture that separates the presentation layer, content management, subscriber services, and analytics.

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- Turbopack

### Content

- Headless CMS
- Structured content models
- Dynamic content retrieval
- Content transformation and sanitization

### Subscriber API

- Python
- FastAPI
- Dedicated API layer for subscriber operations

### Analytics

- PostHog
- Event-based product analytics

### SEO

- Dynamic metadata
- Sitemap generation
- Robots configuration
- Google Search Console integration

## Engineering Highlights

### Decoupled Content Architecture

The frontend consumes structured content from a headless CMS rather than relying on hardcoded article data. This allows editorial content and application code to evolve independently.

### API Layer

Subscriber functionality is isolated into a FastAPI service, keeping application responsibilities separated from the frontend.

### Content Processing

The application includes content cleaning and transformation logic for handling CMS-generated HTML, entities, excerpts, related content, and dynamic article rendering.

### Performance & UX

The interface uses reusable components, responsive layouts, loading states, error handling, and optimized rendering patterns to maintain a fast and consistent reading experience.

### Media System

Daddieshinor treats media as part of the editorial experience, supporting embedded video, article imagery, and controlled ambient audio.

## Project Structure

```text
daddieshinor/
├── src/
│   ├── components/
│   ├── app/
│   └── ...
├── public/
├── next.config.ts
├── tailwind.config.js
├── next-sitemap.config.js
└── package.json
