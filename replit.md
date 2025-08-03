# Crypto Dashboard

## Overview
A full-stack cryptocurrency dashboard application built with React, Express, and TypeScript. Features real-time crypto data, portfolio management, trading simulation, and a comprehensive watchlist system.

## Project Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/UI with Radix UI primitives
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend (Express)
- **Framework**: Express.js with TypeScript
- **Runtime**: tsx for development, compiled with esbuild for production
- **Database**: Drizzle ORM with PostgreSQL (Neon)
- **Authentication**: Passport.js with local strategy
- **Session Management**: Express session with PostgreSQL store

### Key Features
- Real-time cryptocurrency price tracking
- Portfolio management and analytics
- Trading simulation with transaction history
- Watchlist functionality
- Dark/light theme support
- Responsive design for mobile and desktop

## Development Setup
- Server runs on port 5000 (both API and frontend)
- Uses Vite dev server for hot reloading in development
- TypeScript configuration with path aliases (@, @assets, @shared)

## Security Practices
- Client/server separation with API routes
- Input validation using Zod schemas
- Secure session management
- Environment variable configuration for sensitive data

## Recent Changes
- 2025-08-03: Successfully migrated from Replit Agent to standard Replit environment
- Fixed dependency installation issues and tsx runtime
- Created PostgreSQL database and pushed schema
- Configured comprehensive GitHub Pages deployment setup
- Added static authentication and localStorage-based data persistence
- Created automated GitHub Actions deployment workflow

## User Preferences
- Requested GitHub Pages deployment with full environment setup
- Prefers complete deployment guides with all necessary configurations

## Deployment Configuration
- GitHub Actions workflow for automatic deployment
- Static frontend-only deployment with localStorage persistence
- CoinGecko API integration for real-time crypto data
- Mock authentication system for demo purposes
- Optimized build configuration for static hosting

## Next Steps
- Project is fully configured and ready for GitHub Pages deployment
- All environment variables and configuration files are prepared
- Complete deployment guide provided in deployment-guide.md