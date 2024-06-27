import { globalEventEmitter } from '@/event';
import { ContextMenuType } from '@/event/globalEventMap';
import { Menu, Trigger } from '@arco-design/web-react';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { CreateNodeContextMenu } from './CreateNodeContextMenu';

export const GraphEditorContextMenu: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [contextMenu, setContextMenu] = useState<ReactNode>();
  const [isVisible, setIsVisible] = useState(false);

  const handleVisibleChange = (visible: boolean) => {
    if (!visible) setContextMenu(undefined);
    setIsVisible(visible);
  };

  useEffect(() => {
    const onContextMenu = (type: ContextMenuType, context: any) => {
      let a = undefined;
      const handleClose = () => {
        handleVisibleChange(false);
      };

      switch (type) {
        case ContextMenuType.CREATE_NODE:
          a = <CreateNodeContextMenu context={context} onClose={handleClose} />;
          break;

        default:
          break;
      }
      setContextMenu(a);
    };

    globalEventEmitter.on('contextmenu', onContextMenu);

    return () => {
      globalEventEmitter.off('contextmenu', onContextMenu);
    };
  }, []);

  return (
    <Trigger
      popupVisible={isVisible}
      onVisibleChange={handleVisibleChange}
      popup={() => (
        <div style={{ borderRadius: 4, width: 240 }}>
          <Menu>{contextMenu}</Menu>
        </div>
      )}
      trigger="contextMenu"
      position="bl"
      alignPoint
      escToClose
      updateOnScroll
    >
      {children}
    </Trigger>
  );
};
