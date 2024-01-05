import { FC } from 'react';
import { CutsceneTrackTree } from './CutsceneTrackTree';
import { CutsceneGroup } from './core';
import { useDumbState } from './hooks';
import { ProDropdownMenu, DroplistItem } from '@/ui/components';
import { useBindSignal } from './hooks/useBindSignal';
import { PlusIcon } from '@radix-ui/react-icons';

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

  const dropList: DroplistItem[] = [
    {
      name: 'transform track',
      onSelect: (e) => {
        object.addTrack('Transform');
      },
    },
  ];

  return (
    <div className="cutscene-group-panel">
      <div className="cutscene-group-panel-item">
        <div>{object.name}</div>
        <ProDropdownMenu list={dropList}>
          <PlusIcon />
        </ProDropdownMenu>
      </div>
      <CutsceneTrackTree object={object.children} depth={depth + 1} paddingLeft={paddingLeft} />
    </div>
  );
};
