# Arrogance

A comprehensive workout tracking application built with Nuxt.js that helps you manage your fitness journey with powerful features for tracking exercises, routines, and progress.

## Features

### Core Functionality

- **Multi-Profile System**: Create and manage multiple user profiles with seamless switching
- **Exercise Management**: Create and organize custom exercises with detailed tracking
- **Workout Routines**: Build reusable workout templates with exercise sequences
- **Session Logging**: Track sets, reps, weights, and exercise notes during workouts
- **Rest Timer**: Built-in timer with audio alerts and customizable duration
- **Personal Records**: Automatic tracking of best sets and performance metrics
- **Workout History**: Complete history of all workouts with detailed records
- **Sharing**: Share workout summaries via Web Share API or clipboard

### User Experience

- **Anonymous Authentication**: Seamless Firebase auth with automatic setup
- **Dark/Light Mode**: Adaptive theme support with Nuxt UI
- **Mobile-First Design**: Responsive interface optimized for mobile devices
- **Offline Support**: Local state management with automatic sync
- **Real-time Updates**: Optimistic updates with Pinia Colada queries

## Tech Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/) with Vue 3 Composition API
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: Firebase Anonymous Authentication
- **State Management**: [Pinia](https://pinia.vuejs.org/) with [@pinia/colada](https://pinia-colada.esm.dev/)
- **UI Framework**: [Nuxt UI v3](https://ui.nuxt.com/) with Tailwind CSS
- **Icons**: [Lucide](https://lucide.dev/) via @iconify-json/lucide
- **Utilities**: [VueUse](https://vueuse.org/) for composition utilities
- **Date Handling**: [date-fns](https://date-fns.org/) for formatting
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Type Safety**: TypeScript throughout

## Setup

### Prerequisites

- Node.js 18+ or Bun
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:

```bash
gh repo clone krisantuswanandi/arrogance
cd arrogance
```

2. Install dependencies:

```bash
bun install
```

3. Configure Firebase:

```bash
cp .env.example .env
```

Add your Firebase configuration to `.env`:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Development

Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Development Commands

```bash
# Development server
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint

# Build for production
bun run build

# Preview production build
bun run preview
```

## Contributing

No guidelines, just do whatever you want. This is a personal project, so feel free to contribute in any way you see fit.

## Features in Detail

### Workout Flow

1. **Start**: Choose a routine or start a quick workout
2. **Track**: Add exercises, log sets with weight/reps/type
3. **Timer**: Use the rest timer between sets with audio alerts
4. **Notes**: Add exercise and workout notes during the session
5. **Complete**: Save to history and update personal records

### Set Types

- **Normal Sets**: Standard working sets with progressive numbering
- **Drop Sets**: Indicated with ↓ icon for reduced weight sets
- **Warmup Sets**: Marked with 🔥 icon for preparation sets

### Personal Records

- Automatic tracking of best sets by weight and reps
- Historical comparison with last workout performance
- Exercise-specific record modals with detailed history

### Multi-Profile Support

- Switch between different user profiles
- Isolated workout history per profile
- Default profile creation with sample exercises
