import { create } from 'zustand';

export interface ScaleStoreType {
  scale: number;
  setScale: (s: number) => void;
}

export const createScaleStore = () => {
  return create<ScaleStoreType>((set) => ({
    scale: 32,
    setScale: (scale: number) => {
      set({ scale });
    },
  }));
};
