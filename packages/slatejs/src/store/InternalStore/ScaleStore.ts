import { create } from 'zustand';

export interface ScaleStoreType {
  scale: number; // scale == pixels per seconds
  setScale: (s: number) => void;
}

export const useScaleStore = create<ScaleStoreType>((set) => ({
  scale: 32,
  setScale: (scale: number) => {
    set({ scale });
  },
}));
