import { EntityForHierarchy, deerEngine } from 'deer-engine';
import { FC } from 'react';
import { EntityTree } from './EntityTree';
import classNames from 'classnames';

interface EntityProps {
  data: EntityForHierarchy;
  selectedKey: string | undefined;
  depth: number;
  onTreeNodeSelected: (id: string) => void;
}

export const EntityTreeNode: FC<EntityProps> = (props) => {
  const { data, selectedKey, depth, onTreeNodeSelected } = props;

  const isSelected = selectedKey === data.id;

  return (
    <div>
      <div
        className={classNames(
          `group pr-2 h-6 mt-[1px] flex gap-x-1 items-center justify-center`,
          isSelected ? 'text-white bg-primary cursor-default' : 'cursor-pointer hover:bg-hover hover:text-white'
        )}
        style={{ paddingLeft: `${18 * depth}px` }}
        onClick={() => {
          onTreeNodeSelected(data.id);
        }}
      >
        {data.name}
      </div>
      <EntityTree
        data={data.children}
        selectedKey={selectedKey}
        depth={depth + 1}
        onTreeNodeSelected={onTreeNodeSelected}
      />
    </div>
  );
};
