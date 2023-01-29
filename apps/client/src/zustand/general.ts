import create from "zustand";

export interface Solution {
  _id: string;
}

interface GeneralState {
  isChatConnected: boolean;
  setChatConnected: () => void;
}

export const GeneralStore = create<GeneralState>((set, get) => ({
  isChatConnected: false,
  setChatConnected: () => set({ isChatConnected: true }),
}));
