# Workout Log App - Copilot Instructions

## Project Overview

This is a comprehensive workout tracking application built with Nuxt.js that allows users to:

- Create and manage multiple user profiles
- Track exercises and personal records
- Create custom workout routines
- Log workout sessions with sets, reps, and weights
- View workout history and progress

## Tech Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/) with Vue 3 composition API
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) for data storage
- **Authentication**: Firebase Anonymous Authentication
- **State Management**: [Pinia](https://pinia.vuejs.org/) with @pinia/colada for queries
- **UI Components**: [Nuxt UI v3](https://ui.nuxt.com/) with Tailwind CSS
- **Icons**: Lucide icons via @iconify-json/lucide
- **Utilities**: [VueUse](https://vueuse.org/) for composition utilities
- **Type Safety**: TypeScript throughout

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

- `stores/profile.ts`: User profile management (multi-profile support)
- `stores/exercise.ts`: Exercise definitions and CRUD operations
- `stores/routine.ts`: Workout routine creation and management
- `stores/workout.ts`: Active workout session state
- `stores/history.ts`: Completed workout history
- `stores/record.ts`: Personal records tracking

### Data Models & Interfaces

```typescript
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
- Default profile created on first login
- Each profile has its own workout history and records

### Workout Session Flow

1. Start from home page with routine selection or quick start
2. Navigate to `/workout` page with session state
3. Add exercises, log sets with weight/reps/set type
4. Add additional exercises during workout
5. Save to history and update records on completion or cancel

### Set Types and Records

- Normal sets are numbered sequentially
- Drop sets marked with downward arrow icon
- Warmup sets marked with flame icon
- Records track best set (by weight/reps) and last workout sets

### Data Synchronization

- Optimistic updates with mutation invalidation
- Profile-scoped data filtering
- Local storage for active workout state with serialization

## Planned Features

- Start workout routine from history
- Save history as new routine
- Save new routine when finishing workout
- Add rest time timer in active workout
- Add/edit notes in active workout
- Edit routine name in active workout
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
