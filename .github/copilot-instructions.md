# Workout Log App - Copilot Instructions

## Project Overview

This is a comprehensive workout tracking application built with Nuxt.js that allows users to:

- Create and manage multiple user profiles with default data setup
- Track exercises and personal records with best set tracking
- Create custom workout routines with exercise management
- Log workout sessions with sets, reps, weights, and notes
- Use rest timers between sets with audio alerts
- Share workout history via Web Share API or clipboard
- View workout history and progress with detailed records
- Add exercise and workout notes for better tracking

## Tech Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/) with Vue 3 composition API
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) for data storage
- **Authentication**: Firebase Anonymous Authentication with auto-setup
- **State Management**: [Pinia](https://pinia.vuejs.org/) with @pinia/colada for queries
- **UI Components**: [Nuxt UI v3](https://ui.nuxt.com/) with Tailwind CSS
- **Icons**: Lucide icons via @iconify-json/lucide
- **Utilities**: [VueUse](https://vueuse.org/) for composition utilities
- **Type Safety**: TypeScript throughout
- **Analytics**: Vercel Analytics integration
- **Date Handling**: date-fns for formatting and manipulation

## Project Architecture

### Key Directories

- `components/`: Reusable Vue components with consistent UI patterns
- `pages/`: File-based routing with Nuxt auto-routing
- `layouts/`: Application layouts (default with nav, blank for full-screen)
- `stores/`: Pinia stores for state management with Pinia Colada patterns
- `composables/`: Vue composables for shared logic
- `utils/`: Utility functions (Firebase config, etc.)
- `assets/css/`: Global styles with Tailwind and Nuxt UI

### Core Store Modules

- `stores/account.ts`: User authentication and default data setup
- `stores/profile.ts`: User profile management (multi-profile support)
- `stores/exercise.ts`: Exercise definitions and CRUD operations
- `stores/routine.ts`: Workout routine creation and management
- `stores/workout.ts`: Active workout session state
- `stores/history.ts`: Completed workout history
- `stores/record.ts`: Personal records tracking with best sets
- `stores/timer.ts`: Rest timer functionality with audio alerts

### Data Models & Interfaces

```typescript
interface Account {
  uid: string;
}

interface Profile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Exercise {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

type WorkoutSetType = "normal" | "drop" | "warmup";

interface WorkoutSet {
  weight: number;
  reps: number;
  type?: WorkoutSetType;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

interface Workout {
  name: string;
  date: Date;
  notes: string;
  exercises: WorkoutExercise[];
}

interface WorkoutHistory {
  id: string;
  workout: Workout;
  profile: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExerciseRecord {
  bestSet: WorkoutSet;
  lastSets: WorkoutSet[];
  lastNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Development Patterns

### Firebase Integration

- All data stored in Firestore collections: `profiles`, `exercises`, `routines`, `histories`
- Profile-specific records stored in subcollection: `profiles/{profileId}/records`
- User data isolated by Firebase Auth UID
- Server timestamps for consistent created/updated tracking
- Query filters by `uid` and `profile` for multi-profile support
- Anonymous authentication with automatic default data setup on first login

### State Management Patterns

```javascript
// Standard store pattern with Pinia Colada
const { data: items } = useQuery<Item[]>({
  key: ["items"],
  query: () => fetchItems(),
});

const { mutate: addItem } = useMutation({
  mutation: (name: string) => addItem(name),
  onSettled: () => queryCache.invalidateQueries({ key: ["items"] }),
});
```

### Component Patterns

- **CRUD Operations**: Consistent edit/delete dropdown menus on list items
- **Modal Forms**: UModal with form submission patterns
- **List Items**: Reusable item components (ProfileItem, ExerciseItem, RoutineItem)
- **Navigation**: Bottom navigation with UNavigationMenu
- **Floating Actions**: FloatingButton component for primary actions
- **Set Types**: Support for normal, drop, and warmup sets with visual indicators
- **Timer Components**: WorkoutTimer with progress bar and audio alerts
- **Splash Screen**: AppSplash component for app initialization
- **Record Modals**: RecordModal for viewing exercise history and personal records
- **Sharing**: Share functionality via Web Share API or clipboard fallback

### UI/UX Conventions

- **Color System**: Uses Nuxt UI theme with dark/light mode support (primary color: yellow)
- **Typography**: System fonts with consistent heading sizes
- **Layout**: Mobile-first responsive design, max-width container
- **Interactions**: Dropdown menus for actions, modal forms for creation/editing
- **State Feedback**: Loading states, optimistic updates via mutations

## Key Features Implementation

### Multi-Profile System

- Active profile stored in localStorage (`active-profile`)
- Profile switching updates data queries across all stores
- Default profile created on first login with sample exercises
- Each profile has its own workout history and records

### Authentication & Data Setup

- Firebase Anonymous Authentication for seamless user experience
- Automatic default data setup for new users (Default profile + sample exercises)
- Account store manages authentication state and initialization
- Splash screen during app initialization and authentication

### Workout Session Flow

1. Start from home page with routine selection or quick start
2. Navigate to `/workout` page with session state
3. Add exercises, log sets with weight/reps/set type
4. Add exercise notes and workout notes during session
5. Use rest timer between sets with +15/-15 second adjustments
6. Reorder exercises during workout (move up/down)
7. Change exercises mid-workout while preserving sets
8. Save to history and update records on completion or cancel

### Rest Timer System

- Default 2-minute timer with visual progress bar
- Add/reduce time in 15-second increments during countdown
- Audio alerts using Web Audio API with custom alarm sound
- Floating timer component during active workout
- Auto-close timer after completion with delay

### Set Types and Records

- Normal sets are numbered sequentially
- Drop sets marked with downward arrow icon
- Warmup sets marked with flame icon
- Records track best set (by weight/reps), last workout sets, and notes
- Personal record modal shows best set and complete last workout

### Workout Sharing

- Share workout history via Web Share API (mobile) or clipboard fallback
- Formatted text includes workout name, date, notes, and all exercise details
- Set type indicators in shared text (Drop set, Warm up set)
- Toast notifications for successful sharing or copy operations

### Exercise and Workout Notes

- Add notes to individual exercises during workout
- Add notes to entire workout (description/comments)
- Notes preserved in history and displayed in record modals
- Clickable areas for easy note editing during workout

### Data Synchronization

- Optimistic updates with mutation invalidation
- Profile-scoped data filtering
- Local storage for active workout state with serialization
- Automatic default data creation for new users
- Best set calculation and record tracking across workouts

## Planned Features

- Start workout routine from history
- Save history as new routine
- Save new routine when finishing workout
- Connect to Google services
- Share via WhatsApp

## Development Setup

```bash
# Install dependencies
bun install

# Environment setup
cp .env.example .env
# Add Firebase config values

# Development server
bun run dev

# Production build
bun run build
```

## Coding Standards

- **Vue SFC**: `<script setup>` composition API syntax
- **TypeScript**: Strict typing, interfaces for all data models
- **Components**: Props with TypeScript interfaces, typed emits
- **Stores**: Composition API style with computed properties
- **Async**: Firebase operations in separate functions outside stores
- **Naming**: kebab-case for files, camelCase for variables, PascalCase for components

## Common Patterns to Follow

- Use `definePageMeta()` for page-specific configurations
- Implement loading states with query status
- Handle errors gracefully with try/catch in async operations
- Use VueUse composables for common functionality (localStorage, etc.)
- Follow Nuxt UI component patterns for consistent styling
- Implement proper TypeScript interfaces for all data structures

## TODO List Management

- **Complete Tasks**: When completing a feature from TODO.md, remove the item from the list to keep it short and simple
- **Add Future Items**: When asking to hold features for later implementation, add them to TODO.md with appropriate context
- **Keep It Clean**: The TODO list should always stay concise and actionable
