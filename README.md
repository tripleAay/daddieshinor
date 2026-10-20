# Daddieshinor

**A production technology publication platform built for African technology, software engineering, and digital culture.**

[Live Website](https://daddieshinor.com)

Daddieshinor is a production web platform built with a decoupled content architecture. It combines a modern Next.js frontend with headless content management, a dedicated subscriber API, analytics, media handling, and SEO infrastructure.

## Overview

The platform was designed as a production content system rather than a conventional blog, with a focus on:

* Structured content delivery
* Performance and responsive UX
* Maintainable component architecture
* Independent content and application layers
* Analytics and product insights
* Search engine optimization

## Tech Stack

**Frontend**

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router

**Backend & Services**

* FastAPI
* Python
* Headless CMS
* Firebase / Supabase
* PostgreSQL

**Analytics & SEO**

* PostHog
* Google Search Console
* Dynamic metadata
* Sitemap generation
* Robots configuration

## Key Features

* Dynamic article routing with the Next.js App Router
* Headless CMS integration
* Dedicated FastAPI subscriber service
* Dynamic category and content pages
* Content transformation and sanitization
* Embedded video content
* Media-aware article experiences
* Responsive component-driven UI
* Dark mode
* Loading and error states
* SEO metadata and sitemap infrastructure
* Event-based product analytics

## Architecture

The application uses a decoupled architecture that separates the presentation layer, content management, subscriber services, and analytics.

```text
                    ┌─────────────────────┐
                    │     Headless CMS    │
                    │  Structured Content │
                    └──────────┬──────────┘
                               │
                               ▼
┌───────────────┐      ┌──────────────────┐
│   Readers     │ ───► │  Next.js 16 App  │
└───────────────┘      │ React + TypeScript│
                       └────────┬─────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
          Content APIs    Subscriber API   Analytics
                         FastAPI / Python    PostHog
```

## Engineering Highlights

### Decoupled Content Architecture

The frontend consumes structured content from a headless CMS, allowing editorial content and application code to evolve independently.

### Dedicated API Layer

Subscriber operations are isolated into a FastAPI service, keeping backend responsibilities separate from the frontend application.

### Content Processing

The application includes content transformation and sanitization logic for CMS-generated HTML, entities, excerpts, related content, and dynamic article rendering.

### Performance & UX

Reusable components, responsive layouts, loading states, error handling, and optimized rendering patterns are used throughout the application.

### SEO Infrastructure

The platform includes dynamic metadata, sitemap generation, robots configuration, and Google Search Console integration.

## Project Structure

```text
daddieshinor/
├── src/
│   ├── app/
│   ├── components/
│   └── ...
├── public/
├── next.config.ts
├── next-sitemap.config.js
├── tailwind.config.js
└── package.json
```

## Production

The project has been actively developed and deployed through multiple production iterations, with **58 GitHub-tracked deployments**.

## Why I Built It

Daddieshinor was built to explore what a modern digital publication can look like when treated as a software product — combining editorial systems, content infrastructure, analytics, performance, and user experience into one platform.

---

**Built by Adeshina Adedokun**

[Portfolio](https://www.adedokunadeshina.com) • [LinkedIn](https://www.linkedin.com/in/aaytriple03/) • [GitHub](https://github.com/tripleAay)
