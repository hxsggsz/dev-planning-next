import { create } from "zustand";

interface IFibboStore {
  fibbo: string;
  resetFibbo: () => void;
  updateFibbo: (newFibboValue: string) => void;
}

export const useFibboStore = create<IFibboStore>()((set) => ({
  fibbo: "",
  updateFibbo: (newFibboValue) => set(() => ({ fibbo: newFibboValue })),
  resetFibbo: () => set({ fibbo: "" }),
}));
