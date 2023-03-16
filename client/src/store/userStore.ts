import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
export interface User {
  userId: string;
  username: string;
  accessToken: string;
}

interface UserState {
  user?: User;
  setUser: ({ userId, username, accessToken }: User) => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: undefined,
        setUser: (u: User) => set({ user: u }),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export default useUserStore;
