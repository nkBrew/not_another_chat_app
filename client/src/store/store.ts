import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketState {
  socket?: Socket;
  setSocket: (s: Socket) => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: undefined,
  setSocket: (s: Socket) => set({ socket: s }),
}));

export default useSocketStore;
