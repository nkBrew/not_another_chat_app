import { SocketUser } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SocketUsersState {
  socketUsers: SocketUser[];
  setSocketUsers: (su: SocketUser[]) => void;
}

const useSocketUsersStore = create<SocketUsersState>()(
  devtools((set) => ({
    socketUsers: [],
    setSocketUsers: (su: SocketUser[]) => set({ socketUsers: [...su] }),
  })),
);

export default useSocketUsersStore;
