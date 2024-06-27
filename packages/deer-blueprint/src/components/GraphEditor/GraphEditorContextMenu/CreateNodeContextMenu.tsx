import { ContextMenuContext } from '@/event/globalEventMap';
import { useGraphStore, useNodeDefinitionMapStore } from '@/store';
import { Input, Menu } from '@arco-design/web-react';
import { FC, useState } from 'react';

interface CreateNodeContextMenuProps {
  context: ContextMenuContext;
  onClose: () => void;
}

export const CreateNodeContextMenu: FC<CreateNodeContextMenuProps> = (props) => {
  const { context, onClose } = props;
  const { position } = context;

  const [searchStr, setSearchStr] = useState('');

  const addNode = useGraphStore((state) => state.addNode);
  const { nodeCategoryMap } = useNodeDefinitionMapStore();

  return (
    <div style={{ minHeight: 240 }}>
      <Input size="small" autoFocus placeholder="Search Node" value={searchStr} onChange={setSearchStr} />
      {Object.keys(nodeCategoryMap).map((category) => (
        <Menu.SubMenu key={category} title={category}>
          {nodeCategoryMap[category].map((nodeDef) => (
            <Menu.Item
              key={nodeDef.name}
              onClick={() => {
                addNode(nodeDef.name, position);
                onClose();
              }}
            >
              {nodeDef.name}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ))}
      i
    </div>
  );
};
