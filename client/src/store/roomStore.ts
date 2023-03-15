import { Message } from '@not-another-chat-app/common';
import { create } from 'zustand';

interface RoomStore {
  room: string;
  messages: Message[];
  setRoom: (room: string) => void;
  setMessages: (msg: Message[]) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  room: '',
  messages: [],
  setRoom: (r: string) => set({ room: r }),
  setMessages: (msg: Message[]) =>
    set((state) => ({ messages: [...state.messages, ...msg] })),
}));

export default useRoomStore;
