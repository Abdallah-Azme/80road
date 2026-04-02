import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UnlockState {
  /** Set of "userId_listingId" keys that are unlocked */
  unlocked: string[];
  unlock: (userId: string, listingId: number) => void;
  isUnlocked: (userId: string, listingId: number) => boolean;
}

export const useUnlockStore = create<UnlockState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      unlock: (userId, listingId) =>
        set((s) => ({
          unlocked: [...new Set([...s.unlocked, `${userId}_${listingId}`])],
        })),
      isUnlocked: (userId, listingId) =>
        get().unlocked.includes(`${userId}_${listingId}`),
    }),
    { name: 'road80_unlocked' }
  )
);
