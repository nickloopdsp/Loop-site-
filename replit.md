# Loop Splashpage Application

## Overview

This is a full-stack web application built to replicate the Loop music platform's splash page with enhanced functionality. The application features a React-based frontend with Tailwind CSS styling, an Express.js backend, and an integrated OpenAI-powered chatbot for customer support. The project is designed as a standalone application that showcases Loop's brand while providing an interactive FAQ experience through a glass-style chatbox interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for brand colors and design tokens
- **State Management**: TanStack React Query for server state management
- **Build System**: Vite with development server and production build pipeline

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints with focused chat functionality
- **Error Handling**: Centralized error middleware with structured error responses
- **Development Tools**: tsx for TypeScript execution and hot reloading

### Database & ORM
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Database**: PostgreSQL (configured but not actively used in current implementation)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity
- **Storage Fallback**: In-memory storage implementation for development

### Authentication & Session Management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **User Schema**: Basic user model with username/password fields
- **Storage Interface**: Abstracted storage layer supporting both memory and database backends

### Styling & Design System
- **Design Tokens**: CSS custom properties for consistent theming
- **Color Palette**: Loop brand colors including signature green (#02ea98)
- **Component System**: Comprehensive UI component library with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Typography**: Custom font sizing with responsive scaling

### Development & Build Configuration
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Bundling**: Vite for frontend, esbuild for backend production builds
- **Asset Management**: Static asset handling with alias resolution
- **Development Server**: Hot module replacement and error overlay integration

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with resolvers
- **Routing**: Wouter for lightweight routing
- **State Management**: TanStack React Query for server state and caching
- **Build Tools**: Vite, esbuild, TypeScript compiler

### UI & Styling Libraries
- **Component Library**: Complete shadcn/ui component set built on Radix UI
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React icon library
- **Animations**: Embla Carousel for interactive components
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend & Database
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with Neon Database serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Schema Validation**: Zod with Drizzle integration for type-safe schemas

### AI Integration
- **OpenAI API**: Official OpenAI SDK for chat completion functionality
- **Model**: GPT-4o for conversational AI responses
- **Use Case**: Customer support chatbot with Loop-specific knowledge base

### Development Tools
- **Type Checking**: TypeScript with strict configuration
- **Development Runtime**: tsx for TypeScript execution
- **Replit Integration**: Development banner and cartographer plugin
- **Error Handling**: Runtime error modal for development debugging

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Validation**: Zod for schema validation and type inference
- **Styling Utilities**: class-variance-authority for component variants
- **Command Interface**: cmdk for command palette functionality