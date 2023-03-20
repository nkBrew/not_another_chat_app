import { UserBasic } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config, name, serialize } from './storeConfig';

interface OthersState {
  others: Map<string, UserBasic>;
  setOthers: (su: UserBasic[]) => void;
}

const useOthersStore = create<OthersState>()(
  devtools(
    (set) => ({
      others: new Map(),
      // setSocketUsers: (su: SocketUser[]) => set({ socketUsers: [...su] }),
      setOthers: (suarray: UserBasic[]) =>
        set({ others: new Map(suarray.map((o) => [o.userId, o])) }),
    }),
    { ...config, store: 'socketusers' },
  ),
);

export default useOthersStore;
