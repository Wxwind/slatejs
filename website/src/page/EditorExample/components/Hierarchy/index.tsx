import { useBindSignal, useDumbState } from '@/hooks';
import { DeerScene } from 'deer-engine';
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
  const hierarchyData = scene?.entityManager.toTree();

  const refresh = useDumbState();
  useBindSignal(scene?.entityManager.signals.entityTreeViewUpdated, refresh);
  useBindSignal(scene?.entityManager.signals.entitySelected, refresh);

  return (
    <div
      className={classNames(className, 'relative w-full h-full')}
      onClick={(e) => {
        scene?.entityManager.select(undefined);
      }}
    >
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
