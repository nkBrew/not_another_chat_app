import { SocketUser } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config, name, serialize } from './storeConfig';

interface SocketUsersState {
  socketUsers: Map<string, SocketUser>;
  setSocketUsers: (su: SocketUser[]) => void;
}

const useSocketUsersStore = create<SocketUsersState>()(
  devtools(
    (set) => ({
      socketUsers: new Map(),
      // setSocketUsers: (su: SocketUser[]) => set({ socketUsers: [...su] }),
      setSocketUsers: (suarray: SocketUser[]) =>
        set({ socketUsers: new Map(suarray.map((su) => [su.socketId, su])) }),
    }),
    { ...config, store: 'socketusers' },
  ),
);

export default useSocketUsersStore;
