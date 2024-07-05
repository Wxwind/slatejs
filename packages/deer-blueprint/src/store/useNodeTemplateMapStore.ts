import { BPNode } from '@/interface';
import { deepClone } from '@/util/deepClone';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface NodeTemplateMapState {
  nodeTemplateMap: Record<string, BPNode>;
  nodeCategoryMap: Record<string, BPNode[]>;
  registerNodeTemplate: (nodeTemp: BPNode) => void;
  unregisterNodeTemplate: (nodeTemp: BPNode) => boolean;
  createNode: (name: string) => BPNode;
}

export const useNodeTemplateMapStore = create<NodeTemplateMapState, [['zustand/immer', never]]>(
  immer((set, get) => {
    return {
      nodeTemplateMap: {},
      nodeCategoryMap: {},
      registerNodeTemplate: (nodeTemp) => {
        set((draft) => {
          if (draft.nodeCategoryMap[nodeTemp.name] !== undefined)
            throw new Error(`node ${nodeTemp.name}' has already been registered`);
          draft.nodeTemplateMap[nodeTemp.name] = nodeTemp;
          (draft.nodeCategoryMap[nodeTemp.category] ?? (draft.nodeCategoryMap[nodeTemp.category] = [])).push(nodeTemp);
        });
      },
      unregisterNodeTemplate: (nodeTemp) => {
        if (get().nodeCategoryMap[nodeTemp.name] === undefined) {
          return false;
        }

        set((draft) => {
          delete draft.nodeTemplateMap[nodeTemp.name];
          const category = draft.nodeCategoryMap[nodeTemp.category];
          const i = category.findIndex((a) => a === nodeTemp);
          if (i !== -1) category.splice(i, 1);
        });

        return true;
      },

      createNode: (name: string) => {
        const node = get().nodeTemplateMap[name];
        return deepClone(node);
      },
    };
  })
);
