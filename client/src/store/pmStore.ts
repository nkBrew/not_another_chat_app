import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { config, name } from './storeConfig';

interface UserBasic {
  userId: string;
  username: string;
}

interface PMConversation {
  conversationId: string;
  conversationName: string;
  memberIds: string[];
}

interface PMState {
  conversations: Map<string, PMConversation>;
  setConversations: (c: PMConversation[]) => void;
}

const usePMStore = create<PMState>()(
  devtools(
    (set) => ({
      conversations: new Map(),
      setConversations: (convos: PMConversation[]) =>
        set({
          conversations: new Map(convos.map((c) => [c.conversationId, c])),
        }),
    }),
    {
      ...config,
      store: 'pms',
    },
  ),
);

export default usePMStore;
