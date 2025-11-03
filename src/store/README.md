# Store Directory

This directory is for global state management.

## Recommended State Management Solutions

### Option 1: Zustand (Recommended for Next.js 15)
Lightweight, hook-based state management.

```bash
npm install zustand
```

Example store:
```typescript
// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Option 2: Redux Toolkit
For complex state management needs.

```bash
npm install @reduxjs/toolkit react-redux
```

### Option 3: React Context + Hooks
Built-in React solution for simpler cases.

## Suggested Store Structure

```
store/
├── index.ts              # Main exports
├── useAuthStore.ts       # Authentication state
├── useCartStore.ts       # Shopping cart state
├── useNotificationStore.ts # Notifications
├── useUIStore.ts         # UI state (modals, drawers)
└── README.md             # This file
```

## Integration with API Layer

Store actions should use the API utilities from `/utils/apis/`:

```typescript
import { useAuthStore } from '@/store';
import { customerAPI } from '@/utils/apis';

// In your component:
const { user, login } = useAuthStore();

const handleLogin = async () => {
  const { data, error } = await customerAPI.getProfile();
  if (data) {
    login(data, token);
  }
};
```
