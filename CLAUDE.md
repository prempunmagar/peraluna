# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peraluna** is an AI-powered travel planning application that uses conversational AI (Luna) to help users plan personalized trips. The app features a multi-screen interface including authentication, dashboard, trip setup wizard, and an interactive trip planner with real-time chat.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom color palette
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand (lightweight, performant)
- **Forms**: React Hook Form + Zod validation
- **AI**: Anthropic Claude Sonnet 4.5 via Vercel AI SDK
- **Authentication**: NextAuth.js (simple email/password)
- **Database**: (Future) Supabase + Prisma ORM

## Custom Color Palette

The app uses a bold, energetic color scheme:

- **Primary**: Deep Purple `#7c3aed` (124 58 237)
- **Accent**: Bright Cyan `#06b6d4` (6 182 212)
- **Secondary**: Warm Coral `#f97316` (249 115 22)
- **Background**: Near-white `#fafafa` (250 250 250)
- **Text**: Near-black `#0f172a` (15 23 42)

Colors are defined in `app/globals.css` using CSS custom properties with RGB values for Tailwind compatibility. Dark mode uses lighter variations to maintain vibrancy.

## Project Structure

```
perluna/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth routes (login, register)
│   ├── dashboard/               # Dashboard page
│   ├── trip/                    # Trip-related pages
│   │   ├── setup/              # 6-step wizard
│   │   └── [id]/               # Trip planner interface
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles + color palette
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── trip-wizard/             # Setup wizard components
│   ├── trip-planner/            # Trip planner components
│   └── chat/                    # Chat interface components
├── lib/
│   ├── stores/                  # Zustand state stores
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   └── api/                     # API client functions
└── hooks/                       # Custom React hooks
```

## Core Architecture

### State Management (Zustand)

The app uses Zustand stores for different state domains:

- **Auth Store**: User authentication state and session management
- **Trip Store**: Active trip data, all trips list, trip CRUD operations
- **Chat Store**: Chat messages, AI streaming state, conversation history
- **UI Store**: Sidebar collapsed state, modal visibility, loading states

### 3-Column Layout (Trip Planner)

The main trip planner interface uses a responsive 3-column layout:

1. **Left Sidebar** (280px, collapsible): "Your Trips" - list of all user trips
2. **Center** (flexible): Chat interface with Luna AI
3. **Right Sidebar** (320px, sticky): Trip summary with cost tracking

On tablet/mobile, sidebars collapse or stack vertically.

### AI Integration

Luna is powered by Anthropic Claude Sonnet 4.5:

- Uses Vercel AI SDK for streaming responses
- Maintains conversation history per trip
- Function calling for structured actions (add destination, book hotels/flights, update budget)
- System prompt defines Luna's personality as a helpful travel assistant
- API endpoint: `/api/chat`

### Mock Data (Current Phase)

Currently using mock data for rapid UI development:

- Flight data generator in `lib/api/mock-flights.ts`
- Hotel data generator in `lib/api/mock-hotels.ts`
- Activities/restaurants in `lib/api/mock-activities.ts`

Real travel API integrations (Amadeus, Viator) will be added in Phase 7.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## Key Features

### 1. 6-Step Trip Setup Wizard

Multi-step form that collects:
1. Destination (search with autocomplete)
2. Dates (date range picker)
3. Number of travelers
4. Budget (slider + input)
5. Flexibility level
6. Interests (multi-select)

Uses React Hook Form + Zod validation with progress indicator and smooth transitions.

### 2. Conversational Planning with Luna

- Real-time streaming AI responses
- Chat history persisted per trip
- Option cards (flights/hotels) appear inline in chat
- Quick-response buttons for common actions
- Auto-scroll to bottom on new messages
- Typing indicators and loading states

### 3. Real-Time Cost Tracking

- Trip summary updates as items are selected
- Estimated total displayed prominently
- Budget vs actual comparison
- Category breakdown (flights, hotels, activities)
- Visual indicators when approaching budget limits

### 4. Trip Management

- Create, edit, archive trips
- Switch between trips via left sidebar
- Trip status tracking (In Progress, Completed, Pending)
- Draft auto-save to localStorage (database in future)

## Design Principles

### UI/UX Priority

The project prioritizes rich UI/UX polish:

- Smooth animations and transitions (300ms ease)
- Hover effects on interactive elements
- Loading skeletons for async content
- Optimistic updates for instant feedback
- Micro-interactions (button states, focus rings)
- Responsive design (mobile-first approach)

### Component Patterns

- Use shadcn/ui components as base building blocks
- Extend with custom variants using `cva` (class-variance-authority)
- Co-locate component-specific types with components
- Keep components small and focused (Single Responsibility)

### TypeScript Conventions

- Strict mode enabled
- Use interfaces for object shapes, types for unions/primitives
- Export types alongside components
- Avoid `any` - use `unknown` when type is truly unknown

## API Routes

### Current Routes

- `/api/chat` - POST: Stream AI responses from Luna
- `/api/trips` - GET: Fetch all user trips, POST: Create new trip
- `/api/trips/[id]` - GET: Fetch trip details, PATCH: Update trip, DELETE: Delete trip

### Future Routes (Database Integration)

- `/api/auth/[...nextauth]` - NextAuth endpoints
- `/api/bookings` - Manage flight/hotel bookings
- `/api/search/flights` - Search flights via Amadeus API
- `/api/search/hotels` - Search hotels via Amadeus API

## Environment Variables

Create `.env.local` for local development:

```bash
# Anthropic AI
ANTHROPIC_API_KEY=your_api_key_here

# NextAuth (Future)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Supabase (Future)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Travel APIs (Future)
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
```

## Development Guidelines

### Animation & Transitions

Use consistent transition durations:
- Quick feedback: 150ms
- Standard transitions: 300ms
- Complex animations: 500ms

Apply to properties that don't trigger layout: `transform`, `opacity`, `color`

### Form Validation

All forms use Zod schemas for validation:
- Define schema in same file as form
- Use `@hookform/resolvers/zod` for integration
- Show errors inline below fields
- Disable submit button while invalid

### Error Handling

- User-facing errors: Show toast notifications
- API errors: Catch and display friendly messages
- Network errors: Show retry button
- Loading states: Use skeletons, not spinners

### Performance

- Use `React.memo` for expensive renders
- Lazy load heavy components with `next/dynamic`
- Optimize images with `next/image`
- Debounce search inputs (300ms)
- Virtualize long lists (react-virtual)

## Testing Strategy (Future)

- Unit tests: Vitest for utilities and hooks
- Component tests: React Testing Library
- E2E tests: Playwright for critical flows
- API tests: MSW for mocking

## Deployment

- **Platform**: Vercel (optimized for Next.js)
- **Branch**: `main` auto-deploys to production
- **Preview**: PRs get automatic preview deployments
- **Environment**: Set environment variables in Vercel dashboard

## Common Patterns

### Creating a New Page

1. Add route in `app/` directory
2. Export default function component
3. Use TypeScript for props
4. Apply layout with Tailwind classes
5. Add loading.tsx for loading states
6. Add error.tsx for error boundaries

### Adding a Zustand Store

```typescript
// lib/stores/example-store.ts
import { create } from 'zustand';

interface ExampleState {
  value: string;
  setValue: (value: string) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

### Creating a Form

```typescript
// Use React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  field: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## Known Issues / Technical Debt

- Mock data generators need more variety and edge cases
- Authentication is placeholder (implement NextAuth fully)
- No database persistence yet (using localStorage)
- No error boundary components yet
- Need to add accessibility (ARIA labels, keyboard nav)
- No analytics/monitoring setup yet

## Future Enhancements

1. **Phase 7**: Integrate real travel APIs (Amadeus for flights/hotels, Viator for activities)
2. **Phase 8**: Add Supabase database + Prisma ORM for persistence
3. **Phase 9**: Implement full authentication with NextAuth.js
4. **Phase 10**: Add payment processing with Stripe
5. **Phase 11**: Email notifications with SendGrid
6. **Phase 12**: Advanced features (collaborative planning, itinerary sharing, PDF export)

## Support

For questions or issues:
- Check Next.js docs: https://nextjs.org/docs
- shadcn/ui docs: https://ui.shadcn.com
- Vercel AI SDK: https://sdk.vercel.ai/docs
- Anthropic API: https://docs.anthropic.com
