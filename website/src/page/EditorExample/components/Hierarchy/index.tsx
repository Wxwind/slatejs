import { useEngineStore } from '@/hooks';
import { deerEngine } from 'deer-engine';
import { FC } from 'react';
import { EntityTree } from './EntityTree';

interface HierarchyProps {
  className?: string;
}

export const Hierarchy: FC<HierarchyProps> = (props) => {
  const { className } = props;

  const selectedEntityId = useEngineStore(deerEngine.deerStore.selectedEntityIdStore);
  const hierarchyData = useEngineStore(deerEngine.deerStore.hierarchyStore);

  return (
    <div className={className}>
      <EntityTree
        data={hierarchyData || []}
        depth={1}
        selectedKey={selectedEntityId}
        onTreeNodeSelected={(entityId) => {
          deerEngine.apiCenter.selecteEntity(entityId);
        }}
      />
    </div>
  );
};
