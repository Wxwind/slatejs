import { EntityForHierarchy } from 'deer-engine';
import { FC } from 'react';
import { EntityTreeNode } from './EntityTreeNode';

interface EntityTreeProps {
  data: EntityForHierarchy[];
  selectedKey: string | undefined;
  depth: number;
  onTreeNodeSelected: (id: string) => void;
}

export const EntityTree: FC<EntityTreeProps> = (props) => {
  const { data, selectedKey, depth, onTreeNodeSelected } = props;

  return (
    <div className="pb-0.5 w-full">
      {data.map((a) => (
        <EntityTreeNode
          key={a.name}
          selectedKey={selectedKey}
          data={a}
          depth={depth}
          onTreeNodeSelected={onTreeNodeSelected}
        />
      ))}
    </div>
  );
};
