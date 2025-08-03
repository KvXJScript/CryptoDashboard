# CryptoTracker Portfolio Management Application

## Overview

CryptoTracker is a modern full-stack cryptocurrency portfolio management application built with React, Express.js, and PostgreSQL. The application provides simulated cryptocurrency trading capabilities, real-time price tracking through CoinGecko API, portfolio analytics, and watchlist functionality. Users authenticate through Replit's authentication system and can manage their virtual cryptocurrency holdings with a paper trading interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom crypto-themed design system
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds
- **Theme System**: Custom dark/light theme provider with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit Auth with OpenID Connect
- **External APIs**: CoinGecko API for cryptocurrency price data

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL via connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: Users, sessions, holdings, transactions, user balance, and watchlist

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Authorization**: Middleware-based route protection

### Portfolio Management
- **Holdings Tracking**: Real-time portfolio value calculation
- **Transaction History**: Complete audit trail of buy/sell operations
- **Balance Management**: Virtual cash balance for simulated trading
- **Performance Analytics**: Portfolio distribution and P&L tracking

### Trading System
- **Simulated Trading**: Paper trading with virtual currency
- **Real-time Pricing**: Live price feeds from CoinGecko API
- **Order Processing**: Buy/sell order execution with fee calculation
- **Trade Validation**: Balance and holding validation before execution

### Price Data Management
- **Data Source**: CoinGecko API for cryptocurrency prices
- **Caching Strategy**: Client-side caching with 30-second refresh intervals
- **Symbol Mapping**: Internal symbol to CoinGecko ID mapping system
- **Error Handling**: Graceful degradation when price data is unavailable

### User Interface Components
- **Dashboard**: Portfolio overview with key metrics and charts
- **Trading Interface**: Modal-based trading with order preview
- **Portfolio View**: Detailed holdings breakdown and distribution charts
- **Watchlist**: Personalized cryptocurrency tracking
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

### Authentication Flow
1. User initiates login via Replit Auth
2. OpenID Connect validation and token exchange
3. User profile creation or update in database
4. Session establishment with PostgreSQL storage
5. Protected route access granted

### Trading Flow
1. User selects cryptocurrency and trade type
2. Real-time price fetching from CoinGecko
3. Order validation against available balance/holdings
4. Transaction record creation with fee calculation
5. Portfolio holdings and balance updates
6. Real-time UI refresh with updated data

### Data Synchronization
1. Client queries trigger server API calls
2. Server fetches fresh data from database and external APIs
3. Response caching at client level with TanStack Query
4. Automatic background refetching for price updates
5. Optimistic updates for immediate UI feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM and query builder
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **express**: Web application framework
- **passport**: Authentication middleware

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development

### External Services
- **CoinGecko API**: Cryptocurrency price data and market information
- **Replit Auth**: User authentication and profile management
- **Neon Database**: Serverless PostgreSQL hosting

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with ES modules
- **Development Server**: Vite dev server with HMR
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID

### Production Build
- **Frontend**: Vite production build with asset optimization
- **Backend**: esbuild compilation to single bundle
- **Static Assets**: Served from dist/public directory
- **Process Management**: Single Node.js process with Express

### Replit Deployment
- **Platform**: Replit autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment**: Automatic Replit Auth integration

## Changelog

```
Changelog:
- August 3, 2025. Successfully migrated from Replit Agent to Replit environment
- August 3, 2025. Converted to frontend-only deployment compatible with GitHub Pages
- August 3, 2025. Replaced backend authentication with localStorage-based mock system
- August 3, 2025. Updated all components to use mock data and localStorage persistence
- June 16, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```