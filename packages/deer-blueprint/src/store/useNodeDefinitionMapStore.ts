import { BPNodeDefinition } from '@/interface';
import { pushUnique } from '@/util';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface NodeDefinitionMapState {
  nodeDefinitionMap: Record<string, BPNodeDefinition>;
  nodeCategoryMap: Record<string, BPNodeDefinition[]>;
  registerNodeDefinition: (nodeDef: BPNodeDefinition) => void;
  unregisterNodeDefinition: (nodeDef: BPNodeDefinition) => boolean;
}

export const useNodeDefinitionMapStore = create<NodeDefinitionMapState, [['zustand/immer', never]]>(
  immer((set, get) => {
    return {
      nodeDefinitionMap: {},
      nodeCategoryMap: {},
      registerNodeDefinition: (nodeDef) => {
        set((draft) => {
          if (draft.nodeCategoryMap[nodeDef.name] !== undefined)
            throw new Error(`node ${nodeDef.name}' has already been registered`);
          draft.nodeDefinitionMap[nodeDef.name] = nodeDef;
          (draft.nodeCategoryMap[nodeDef.category] ?? (draft.nodeCategoryMap[nodeDef.category] = [])).push(nodeDef);
        });
      },
      unregisterNodeDefinition: (nodeDef) => {
        if (get().nodeCategoryMap[nodeDef.name] === undefined) {
          return false;
        }

        set((draft) => {
          delete draft.nodeDefinitionMap[nodeDef.name];
          const category = draft.nodeCategoryMap[nodeDef.category];
          const i = category.findIndex((a) => a === nodeDef);
          if (i !== -1) category.splice(i, 1);
        });

        return true;
      },
    };
  })
);
