import { UserBasic } from '@not-another-chat-app/common';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { config, name, serialize } from './storeConfig';

interface OthersState {
  others: Map<string, UserBasic>;
  setOthers: (su: UserBasic[]) => void;
  setOther: (other: UserBasic) => void;
}

const useOthersStore = create<OthersState>()(
  devtools(
    (set) => ({
      others: new Map(),
      // setSocketUsers: (su: SocketUser[]) => set({ socketUsers: [...su] }),
      setOthers: (suarray: UserBasic[]) =>
        set({ others: new Map(suarray.map((o) => [o.userId, o])) }),
      setOther: (other: UserBasic) =>
        set((state) => {
          const others = new Map(state.others);
          others.set(other.userId, other);
          return { others };
        }),
    }),
    { ...config, store: 'socketusers' },
  ),
);

export default useOthersStore;
