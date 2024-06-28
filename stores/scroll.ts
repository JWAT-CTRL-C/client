import { StateCreator } from 'zustand';

export interface ScrollState {
  scrollY: number;
}

export interface ScrollAction {
  setScrollY: (scrollY: number) => void;
}

export const createScrollStore: StateCreator<ScrollState & ScrollAction> = (set) => ({
  scrollY: 0,
  setScrollY: (scrollY: number) => set({ scrollY })
});
