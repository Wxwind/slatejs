import { useGraphStore } from '@/store';
import { Input, Menu } from '@arco-design/web-react';
import { FC, useState } from 'react';

interface CreateNodeContextMenuProps {}

export const CreateNodeContextMenu: FC<CreateNodeContextMenuProps> = (props) => {
  const {} = props;

  const [searchStr, setSearchStr] = useState('');
  const addNode = useGraphStore((state) => state.addNode);

  return (
    <div style={{ minHeight: 240 }}>
      <Input autoFocus placeholder="Search Node" value={searchStr} onChange={setSearchStr} />
      <Menu.SubMenu key="123" title={'built-in'}>
        <Menu.Item
          key="123"
          onClick={() => {
            // addNode()
          }}
        >
          123
        </Menu.Item>
      </Menu.SubMenu>
    </div>
  );
};
