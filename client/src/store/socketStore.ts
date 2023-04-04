import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config } from './storeConfig';

interface SocketState {
  socket?: Socket;
  setSocket: (s: Socket) => void;
  removeSocket: () => void;
}

const useSocketStore = create<SocketState>()(
  devtools(
    (set) => ({
      socket: undefined,
      setSocket: (s: Socket) => set({ socket: s }),
      removeSocket: () => set({ socket: undefined }),
    }),
    // { ...config, store: 'socket' },
  ),
);

export default useSocketStore;
