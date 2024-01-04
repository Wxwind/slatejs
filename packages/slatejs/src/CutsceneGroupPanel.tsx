import { FC } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { CutsceneTrackTree } from './CutsceneTrackTree';
import { CutsceneGroup } from './core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDumbState } from './hooks';
import { useBindSignal } from './hooks/useBindSignal';

interface CutsceneGroupPanelProps {
  // style
  depth: number;
  paddingLeft: number;
  object: CutsceneGroup;
}

export const CutsceneGroupPanel: FC<CutsceneGroupPanelProps> = (props) => {
  const { object, depth, paddingLeft } = props;

  const [refresh] = useDumbState();
  useBindSignal(object.signals.trackCountChanged, refresh);
  useBindSignal(object.signals.groupUpdated, refresh);

  return (
    <div className="cutscene-group-panel">
      <div className="cutscene-group-panel-item">
        <div>{object.name}</div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <PlusIcon />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white rounded">
              <DropdownMenu.Item
                className="group text-[13px] leading-none text-violet-400 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet-100"
                onSelect={(e) => {
                  object.addTrack('Transform');
                }}
              >
                Transform Track
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <CutsceneTrackTree object={object.children} depth={depth + 1} paddingLeft={paddingLeft} />
    </div>
  );
};
