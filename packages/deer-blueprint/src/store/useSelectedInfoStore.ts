import { pushUnique } from '@/util';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SelectedInfoState {
  selectedNodes: string[];
  selectedConnections: string[];
  addSelectedNodes: (ids: string[], forceSet?: boolean) => void;
  toggleSelectedNodes: (ids: string[]) => void;
  cancelConnection: () => void;
  clearSelection: () => void;
}

export const useSelectedInfoStore = create<SelectedInfoState, [['zustand/immer', never]]>(
  immer((set, get) => {
    return {
      selectedNodes: [] as string[],
      selectedConnections: [] as string[],
      toggleSelectedNodes: (ids) => {
        const { selectedNodes } = get();
        for (const id of ids) {
          const index = selectedNodes.findIndex((a) => {
            a === id;
          });
          if (index === -1) {
            selectedNodes.push(id);
          } else {
            selectedNodes.splice(index, 1);
          }
        }
      },
      addSelectedNodes: (ids, forceSet = false) => {
        set((draft) => {
          forceSet ? (draft.selectedNodes = ids) : pushUnique(draft.selectedNodes, ids);
        });
      },
      cancelConnection: () => {},
      clearSelection: () => {
        set({ selectedNodes: [], selectedConnections: [] });
      },
    };
  })
);
