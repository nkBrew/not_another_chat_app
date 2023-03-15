import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
  devtools((set) => ({
    user: undefined,
    setUser: (u: User) => set({ user: u }),
  })),
);

export default useUserStore;
