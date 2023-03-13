import { create } from 'zustand';

interface RoomStore {
  room: string;
  messages: string[];
  setRoom: (room: string) => void;
  setMessages: (msg: string) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  room: '',
  messages: [],
  setRoom: (r: string) => set({ room: r }),
  setMessages: (msg: string) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));

export default useRoomStore;
