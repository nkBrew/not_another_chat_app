import { create } from 'zustand';

interface RoomStore {
  room: string;
  setRoom: (room: string) => void;
}

const useRoomStore = create<RoomStore>((set) => ({
  room: '',
  setRoom: (r: string) => set({ room: r }),
}));

export default useRoomStore;
