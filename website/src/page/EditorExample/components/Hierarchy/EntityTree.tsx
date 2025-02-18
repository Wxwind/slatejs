import { Entity, EntityForHierarchy } from 'deer-engine';
import { FC } from 'react';
import { EntityTreeNode } from './EntityTreeNode';

interface EntityTreeProps {
  data: EntityForHierarchy[];
  selectedEntities: Entity[] | undefined;
  depth: number;
  onTreeNodeSelected: (id: string) => void;
}

export const EntityTree: FC<EntityTreeProps> = (props) => {
  const { data, selectedEntities, depth, onTreeNodeSelected } = props;

  return (
    <div className="pb-0.5 w-full">
      {data.map((a) => (
        <EntityTreeNode
          key={a.id}
          selectedEntities={selectedEntities}
          data={a}
          depth={depth}
          onTreeNodeSelected={onTreeNodeSelected}
        />
      ))}
    </div>
  );
};
