import CanvasKitInit, { CanvasKit } from 'canvaskit-wasm';
import { create } from 'zustand';

type CanvaskitStoreType = {
  canvaskit: CanvasKit | undefined;
  isLoading: boolean;
  getCanvaskit: () => CanvasKit | undefined;
};

export const useCanvaskitStore = create<CanvaskitStoreType>((set, get) => ({
  canvaskit: undefined,
  isLoading: false,
  getCanvaskit: () => {
    const store = get();
    const res = store.canvaskit;
    if (res) {
      return res;
    }
    if (store.isLoading) {
      return;
    }

    const init = async () => {
      set({ isLoading: true });
      const ck = await CanvasKitInit({
        locateFile: (file) => {
          console.log('file', file); // canvaskit.wasm
          // https://libs.cdnjs.net/canvaskit-wasm/0.39.1/
          return '/' + file;
        },
      });
      set({ canvaskit: ck, isLoading: false });
      return ck;
    };

    init();
    return undefined;
  },
}));
