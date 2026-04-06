import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  phone: string;
  name: string;
  avatar: string | null;
  token?: string; // Storing the token here for simplicity, although cookie reflects in middleware
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'road80_user',
    }
  )
);
