import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { create } from 'zustand';

interface StageStoreProps {
  draggable: boolean;
  width: number;
  height: number;
  position: Konva.Vector2d;
  scale: Konva.Vector2d;
  setSize: (width: number, height: number) => void;
  setPosition: (position: Konva.Vector2d) => void;
  setScale: (scale: number) => void;
  viewportToWorldPosition: (viewPos: Konva.Vector2d) => Konva.Vector2d;
  getPointerWorldPosition: (stage: Stage) => Konva.Vector2d;
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
    setScale: (scale: number) => {
      set({ scale: { x: scale, y: scale } });
    },
    viewportToWorldPosition: (viewPos) => {
      const { position, scale } = get();
      return {
        x: (viewPos.x - position.x) / scale.x,
        y: (viewPos.y - position.y) / scale.y,
      };
    },
    getPointerWorldPosition: (stage) => {
      const viewPos = stage.getPointerPosition() || { x: 0, y: 0 };
      return get().viewportToWorldPosition(viewPos);
    },
  };
});
