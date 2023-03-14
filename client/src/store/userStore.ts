import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
export interface User {
  userId: string;
  email: string;
  accessToken: string;
}

interface UserState {
  user?: User;
  setUser: ({ userId, email, accessToken }: User) => void;
}

const useUserStore = create<UserState>()(
  devtools((set) => ({
    user: undefined,
    setUser: (u: User) => set({ user: u }),
  })),
);

export default useUserStore;
