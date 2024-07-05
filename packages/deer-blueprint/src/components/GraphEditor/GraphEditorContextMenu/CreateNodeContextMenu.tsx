import { ContextMenuContext } from '@/event/globalEventMap';
import { useGraphStore, useNodeTemplateMapStore } from '@/store';
import { genUUID, groupBy } from '@/util';
import { Input, Menu } from '@arco-design/web-react';
import { FC, useState } from 'react';
import Fuse from 'fuse.js';
import Highlighter from 'react-highlight-words';

interface CreateNodeContextMenuProps {
  context: ContextMenuContext;
  onClose: () => void;
}

export const CreateNodeContextMenu: FC<CreateNodeContextMenuProps> = (props) => {
  const { context, onClose } = props;
  const { position } = context;

  const [searchStr, setSearchStr] = useState('');

  const addNode = useGraphStore((state) => state.addNode);
  const { nodeTemplateMap, createNode } = useNodeTemplateMapStore();

  const filteredNoteCategoryList =
    searchStr === ''
      ? Object.values(nodeTemplateMap)
      : new Fuse(Object.values(nodeTemplateMap), { keys: ['label'] }).search(searchStr).map((a) => a.item);

  const nodeCategoryMap = groupBy(filteredNoteCategoryList, (el) => el.category);

  console.log(nodeTemplateMap, nodeCategoryMap);

  return (
    <div style={{ minHeight: 240 }}>
      <Menu>
        <Input size="small" autoFocus placeholder="Search Node" value={searchStr} onChange={setSearchStr} />
        {Object.keys(nodeCategoryMap).map((category) => (
          <Menu.SubMenu key={category} title={category}>
            {nodeCategoryMap[category].map((nodeTemp) => (
              <Menu.Item
                key={nodeTemp.name}
                onClick={() => {
                  const node = createNode(nodeTemp.name);
                  node.id = genUUID();
                  node.position = position;
                  addNode(node);
                  onClose();
                }}
              >
                <Highlighter searchWords={searchStr.split('')} textToHighlight={nodeTemp.label} />
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    </div>
  );
};
