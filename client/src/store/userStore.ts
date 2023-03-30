import { create } from 'zustand';
import { config } from './storeConfig';

import { createJSONStorage, devtools, persist } from 'zustand/middleware';
export interface User {
  userId: string;
  username: string;
  accessToken: string;
}

export interface UserState {
  user?: User;
  setUser: ({ userId, username, accessToken }: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: undefined,
        setUser: (u: User) => set({ user: u }),
        logout: () => set({ user: undefined }),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { ...config, store: 'user' },
  ),
);

export default useUserStore;
