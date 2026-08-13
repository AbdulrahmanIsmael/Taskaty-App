# Taskaty

A mobile task management application built from scratch — my first complete mobile app, built with a product mindset rather than as a basic Todo List tutorial.

Taskaty helps users organize daily tasks, track progress, and stay consistent through completed-task tracking and streaks. It includes a full authentication flow, a real backend (Supabase), user-specific data isolation, and account management — not just local/mock data.

**Current version:** `v1.0.1` (patch release, bug fixes over the initial `v1.0.0`)

---

## Features

### Onboarding
- First-launch onboarding experience introducing the app before entering the main flow.

### Authentication
- Registration and login with email/password
- Email verification
- Persistent session handling
- Authentication state management with automatic redirects based on session state

### Task Management
- Create, edit, and delete tasks
- Mark tasks as completed
- Assign priorities
- Add optional descriptions
- Schedule tasks with date and time

### Task Scheduling
- Date and time picker
- Android-specific implementation using `DateTimePickerAndroid` (fixes a native update issue with the component-based picker)
- Separate, compatible iOS implementation

### Progress & Streaks
- Tracks completed tasks and current streak to help users monitor consistency

### Account Management
- Update full name and email (with re-verification on email change)
- Change password
- Permanently delete account, including all associated profile and task data

### Offline Handling
- Detects connectivity via `@react-native-community/netinfo`
- Displays an offline modal when the device has no internet connection

---

## Tech Stack

**Mobile**
- React Native
- Expo SDK
- Expo Router
- TypeScript

**Backend**
- Supabase (Auth, PostgreSQL database, backend functionality)

**Database**
- PostgreSQL via Supabase
- User-specific task and profile data
- Foreign-key relationships tied to `auth.users`

**UI / Navigation**
- Expo Router
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `react-native-reanimated`

**Other Libraries**
- `@react-native-community/datetimepicker`
- `@react-native-community/netinfo`
- `react-native-toast-message`
- `@expo/vector-icons`
- `expo-sqlite`
- `expo-font`
- `@react-native-async-storage/async-storage`

---

## Architecture

The project uses a **feature-oriented architecture** rather than a single flat folder of screens and components.

- **Auth feature** — its own screens, components, hooks, and validation helpers
- **Task feature** — its own screens, components, scheduling UI, and priority components
- **Shared layer** — reusable UI components, custom hooks, validation helpers, centralized theme/colors, and TypeScript types

---

## Authentication Flow

Built on **Supabase Auth**.

**Registration**
1. User submits full name, email, password, confirm password
2. Client-side validation runs
3. Supabase creates the auth account
4. Email verification is required where applicable
5. User is redirected to the verification screen
6. On success, user enters the main app

**Login**
1. User submits email and password
2. Client-side validation runs
3. Supabase authenticates the user
4. Auth state updates and the user is redirected into the app

**Session Handling**
- The root layout checks for an existing Supabase session on load
- The app subscribes to `supabase.auth.onAuthStateChange(...)` and redirects users appropriately on sign-in/sign-out events

---

## Task Data

Each task is associated with its authenticated owner (rather than nested inside a profile record), keeping user data isolated — one user cannot access another's tasks.

A task includes:
- ID
- Title
- Description
- Priority
- Date
- Time
- Completion state
- Creation timestamp
- User association

---

## Task Form

A single reusable task form and scheduling component handles both creating new tasks and editing existing ones, covering title, description, priority, date, and time.

---

## Date & Time Picker

Built on `@react-native-community/datetimepicker`. The initial component-based implementation had an Android bug where the picker failed to properly reflect the selected date/time. This was resolved by switching the Android flow to the **imperative `DateTimePickerAndroid` API**, which opens the native dialog independently of React re-renders. iOS uses its own compatible implementation.

---

## Keyboard Handling

Auth screens use `KeyboardAvoidingView`. On Android, using `behavior="height"` caused a gray rectangle above the navigation bar and pushed content upward when the keyboard dismissed. Fixed by scoping the behavior per platform:

```tsx
behavior={Platform.OS === "ios" ? "padding" : undefined}
```

Android handles keyboard/window behavior natively; iOS uses padding.

---

## Offline Handling

Connectivity is monitored via `@react-native-community/netinfo`. When offline, an `OfflineModal` informs the user instead of letting them interact with network-dependent features silently.

---

## Navigation

Handled with **Expo Router** using route groups to separate concerns (e.g. authentication routes vs. main app routes). The root layout owns global authentication state and drives redirects based on session.

---

## Global App Structure

The root layout is responsible for:
- Authentication session checks and state-change subscriptions
- Navigation redirects
- Network state monitoring and the offline modal
- Toast notifications
- Safe-area handling
- The `GestureHandlerRootView` root gesture container

---

## Getting Started

### Prerequisites
- Node.js
- npm
- Expo CLI (`npx expo`)
- A Supabase project

### Installation

```bash
git clone https://github.com/AbdulrahmanIsmael/Taskaty-App.git
cd Taskaty-App
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Set up the database tables for `tasks` and user profiles, with foreign keys referencing `auth.users`
3. Configure Row Level Security (RLS) policies so each user can only access their own data
4. Deploy the account-deletion Edge Function (deleting an `auth.users` record requires server-side privileges)
5. Copy your project URL and anon key into `.env`

### Running the Project

```bash
npm run start        # Start Expo dev server (tunnel mode)
npm run start-c      # Start with cache cleared
npm run android       # Run on Android
npm run ios          # Run on iOS
npm run web          # Run in web (experimental)
```

### Building the APK

```bash
npm run preview
```

Uses the `preview` EAS Build profile to produce an installable APK for direct distribution/testing. For app-store distribution, an Android App Bundle (`.aab`) build profile would be used instead.

---

## Versioning

Follows [Semantic Versioning](https://semver.org/):
- **MAJOR** — breaking changes
- **MINOR** — new features
- **PATCH** — bug fixes

Current: `v1.0.1` — a patch release over `v1.0.0`, including a fix for the Android keyboard/layout issue.

---

## Roadmap / Future Improvements

- Google authentication
- Push notifications
- More advanced task categorization
- Productivity analytics
- Additional task filtering/sorting
- Further UI/UX polish
- Production deployment and app store distribution

---

## Author

**Abdulrahman Ismael**
<br/>
Frontend Engineer