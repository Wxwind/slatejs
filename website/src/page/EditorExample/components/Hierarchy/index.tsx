import { useEngineStore } from '@/hooks';
import { DeerScene, deerEngine } from 'deer-engine';
import { FC } from 'react';
import { EntityTree } from './EntityTree';
import classNames from 'classnames';

interface HierarchyProps {
  className?: string;
  scene: DeerScene | undefined;
}

export const Hierarchy: FC<HierarchyProps> = (props) => {
  const { className, scene } = props;

  const selectedEntity = scene?.entityManager.selectedEntity;
  const hierarchyData = useEngineStore(deerEngine.deerStore.hierarchyStore);

  return (
    <div className={classNames(className, 'relative w-full')}>
      <EntityTree
        data={hierarchyData || []}
        depth={1}
        selectedEntity={selectedEntity}
        onTreeNodeSelected={(entityId) => {
          scene?.entityManager.select(entityId);
        }}
      />
    </div>
  );
};
