# PR Party Invitation Project Structure

## Main Directories and Files

### Root Directory
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build tool configuration
- `components.json` - Shadcn UI components configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Client Directory (`/client`)
- `/src` - Source code for the front-end
  - `/components` - React components
    - `/ui` - Shadcn UI components
    - Other components like `RSVPForm.tsx`, `ShareMemorySection.tsx`, etc.
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions
  - `/pages` - Page components
  - `App.tsx` - Main application component
  - `main.tsx` - Entry point
  - `index.css` - Global CSS

### Server Directory (`/server`)
- `index.ts` - Server entry point
- `routes.ts` - API routes
- `storage.ts` - Data storage interface
- `vite.ts` - Vite integration with Express
- `db.ts` - Database connection
- `supabase.ts` - Supabase configuration

### Shared Directory (`/shared`)
- `schema.ts` - Data models and schemas

## Key Components

### Main Pages
- `Home.tsx` - Main landing page
- `Admin.tsx` - Admin dashboard (password protected)
- `not-found.tsx` - 404 page

### Feature Components
- `HeroSection.tsx` - Hero banner at the top
- `AboutSection.tsx` - Information about the celebration
- `CountdownTimer.tsx` - Countdown to the event
- `ImageGallery.tsx` - Photo gallery
- `RSVPForm.tsx` - RSVP form with badge system
- `ShareMemorySection.tsx` - Memory sharing functionality
- `MapSection.tsx` - Location map
- `Footer.tsx` - Footer with contact info and credits

### State Management
- `useSupabase.ts` - Hook for interacting with Supabase (fallback to localStorage)

## Data Flow

1. User interacts with the UI (submits RSVP, shares memory, etc.)
2. Data is saved to localStorage
3. In parallel, an attempt is made to save to the API (optional, fallback)
4. When viewing data, it's first loaded from localStorage, then supplemented with API data if available

## Customization Points

### Event Details
- Update event date/time in `CountdownTimer.tsx`
- Update location in `MapSection.tsx`
- Update host information in various components

### Styling
- Main color scheme in `tailwind.config.ts`
- Global styles in `index.css`
- Component-specific styles in each component file

### Functionality
- Badge generation in `RSVPForm.tsx`
- Memory viewing prompt in `ShareMemorySection.tsx`
- Admin password in `Admin.tsx`
