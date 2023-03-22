import { Message } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config } from './storeConfig';

interface RoomStore {
  room: string;
  messages: Message[];
  setRoom: (room: string) => void;
  setMessages: (msg: Message[]) => void;
  conversationId: string;
  setConversationId: (id: string) => void;
}

const useRoomStore = create<RoomStore>()(
  devtools(
    (set) => ({
      room: '',
      messages: [],
      setRoom: (r: string) => set({ room: r }),
      setMessages: (msg: Message[]) =>
        set((state) => ({ messages: [...state.messages, ...msg] })),
      conversationId: '',
      setConversationId: (id: string) => set({ conversationId: id }),
    }),
    { ...config, store: 'roomStore' },
  ),
);

export default useRoomStore;
