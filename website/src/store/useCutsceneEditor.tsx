import { CutsceneEditor } from 'deer-engine';
import { create } from 'zustand';

interface CutsceneEditorStore {
  cutsceneEditor: CutsceneEditor | undefined;
  setCutsceneEditor: (cutsceneEditor: CutsceneEditor | undefined) => void;
}

export const useCutsceneEditorStore = create<CutsceneEditorStore>((set, get) => ({
  cutsceneEditor: undefined,
  setCutsceneEditor: (cutsceneEditor) => {
    const oldCutsceneEditor = get().cutsceneEditor;
    if (oldCutsceneEditor !== undefined) oldCutsceneEditor.destroy();
    set({ cutsceneEditor });
  },
}));
