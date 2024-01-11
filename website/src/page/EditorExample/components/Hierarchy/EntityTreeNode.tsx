import { Entity, EntityForHierarchy, deerEngine } from 'deer-engine';
import { FC, useState } from 'react';
import { EntityTree } from './EntityTree';
import classNames from 'classnames';

interface EntityProps {
  data: EntityForHierarchy;
  selectedEntity: Entity | undefined;
  depth: number;
  onTreeNodeSelected: (id: string) => void;
}

export const EntityTreeNode: FC<EntityProps> = (props) => {
  const { data, selectedEntity, depth, onTreeNodeSelected } = props;
  const [isDragging, setIsDragging] = useState(false);

  const isSelected = selectedEntity?.id === data.id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', data.id);
        e.dataTransfer.setDragImage(e.currentTarget, 40, 40);
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
    >
      <div
        className={classNames(
          `group pr-2 h-6 mt-[1px] flex gap-x-1 items-center w-full`,
          isSelected ? 'text-white bg-primary cursor-default' : 'cursor-pointer hover:bg-hover hover:text-white'
        )}
        style={{ paddingLeft: `${18 * depth}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onTreeNodeSelected(data.id);
        }}
      >
        {data.name}
      </div>
      <EntityTree
        data={data.children}
        selectedEntity={selectedEntity}
        depth={depth + 1}
        onTreeNodeSelected={onTreeNodeSelected}
      />
    </div>
  );
};
