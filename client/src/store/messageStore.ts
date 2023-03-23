import { Message } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config } from './storeConfig';

interface MessageStore {
  // room: string;
  // setRoom: (room: string) => void;
  messages: Map<string, Message[]>;
  conversationId: string;
  setMessages: (conversationId: string, msg: Message[]) => void;
  setConversationId: (id: string) => void;
}

const useMessageStore = create<MessageStore>()(
  devtools(
    (set) => ({
      messages: new Map(),
      // setMessages: (msg: Message[]) =>
      //   set((state) => ({ messages: [...state.messages, ...msg] })),
      setMessages: (conversationId: string, msgs: Message[]) =>
        set((state) => {
          const existing = state.messages.get(conversationId);
          const existingMessages = existing ? existing : [];
          const updatedMessages = new Map(state.messages);

          updatedMessages.set(
            conversationId,
            [...existingMessages, ...msgs].sort(
              (a, b) => a.timestamp - b.timestamp,
            ),
          );
          return { messages: updatedMessages };
        }),
      conversationId: '',
      setConversationId: (id: string) => set({ conversationId: id }),
    }),
    { ...config, store: 'roomStore' },
  ),
);

export default useMessageStore;
