import { DeerEngine } from 'deer-engine';
import { create } from 'zustand';

interface EngineStore {
  engine: DeerEngine | undefined;
  setEngine: (engine: DeerEngine | undefined) => void;
}

export const useEngineStore = create<EngineStore>((set, get) => ({
  engine: undefined,
  setEngine: (engine) => {
    const oldEngine = get().engine;
    if (oldEngine !== undefined) oldEngine.destroy();
    set({ engine });
  },
}));
