import { FC } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { CutsceneTrackTree } from './CutsceneTrackTree';
import { GroupData, cutscene } from './core';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CutsceneGroupPanelProps {
  data: GroupData;
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneGroupPanel: FC<CutsceneGroupPanelProps> = (props) => {
  const { data, depth, paddingLeft } = props;

  return (
    <div className="cutscene-group-panel">
      <div className="cutscene-group-panel-item">
        <div>{data.name}</div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <PlusIcon />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white rounded">
              <DropdownMenu.Item
                className="group text-[13px] leading-none text-violet-400 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet-100"
                onSelect={(e) => {
                  cutscene.apiCenter.addTrack(data.id, 'Transform');
                }}
              >
                Transform Track
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <CutsceneTrackTree data={data.children} depth={depth + 1} paddingLeft={paddingLeft} />
    </div>
  );
};
