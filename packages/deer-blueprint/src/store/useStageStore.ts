import Konva from 'konva';
import { create } from 'zustand';
import { Draft, produce } from 'immer';

interface StageStoreProps {
  draggable: boolean;
  width: number;
  height: number;
  position: Konva.Vector2d;
  scale: Konva.Vector2d;
  setSize: (width: number, height: number) => void;
}

export const useStageStore = create<StageStoreProps>((set, get) => {
  return {
    draggable: false,
    width: 500,
    height: 500,
    position: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    setSize: (width: number, height: number) => {
      set({ width, height });
    },
    setPosition: (position: Konva.Vector2d) => {
      set({ position });
    },
  };
});
