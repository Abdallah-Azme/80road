import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authStorage } from '@/shared/utils/auth-storage';

interface User {
  id: number;
  phone: string;
  name: string;
  avatar: string | null;
  token?: string;
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
      logout: () => {
        // Clear all storage layers (cookies + localStorage + Capacitor)
        authStorage.removeToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'road80_user',
    }
  )
);
