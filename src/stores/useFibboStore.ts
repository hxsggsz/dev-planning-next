import { create } from "zustand";

interface IFibboStore {
  fibbo: string;
  isFibboReveal: boolean;
  resetFibbo: () => void;
  revealFibbo: (shouldI?: boolean) => void;
  updateFibbo: (newFibboValue: string) => void;
}

export const useFibboStore = create<IFibboStore>()((set) => ({
  fibbo: "",
  isFibboReveal: false,
  revealFibbo: (shouldI) =>
    set((state) => ({
      isFibboReveal:
        typeof shouldI !== "undefined" ? shouldI : !state.isFibboReveal,
    })),
  updateFibbo: (newFibboValue) => set(() => ({ fibbo: newFibboValue })),
  resetFibbo: () => set({ fibbo: "" }),
}));
