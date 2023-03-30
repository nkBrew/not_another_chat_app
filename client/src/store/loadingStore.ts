import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LoadingStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoadingStore = create<LoadingStore>()(
  devtools((set) => ({
    loading: true,
    setLoading: (l: boolean) => set({ loading: l }),
  })),
);

export default useLoadingStore;
