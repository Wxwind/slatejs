import { FC } from 'react';
import { CutsceneTrackTree } from './CutsceneTrackTree';
import { CutsceneGroup, CutsceneTrack, getMetadataFromCtor, getSubclassOf } from 'deer-engine';
import { useDumbState, useBindSignal } from '@/hooks';
import { ProDropdownMenu, DroplistItem } from '@/assets/components';
import { PlusIcon } from '@radix-ui/react-icons';

interface CutsceneGroupPanelProps {
  // style
  depth: number;
  paddingLeft: number;
  object: CutsceneGroup;
}

export const CutsceneGroupPanel: FC<CutsceneGroupPanelProps> = (props) => {
  const { object, depth, paddingLeft } = props;

  const refresh = useDumbState();
  useBindSignal(object.signals.trackCountChanged, refresh);
  useBindSignal(object.signals.groupUpdated, refresh);

  const tracks = getSubclassOf(CutsceneTrack);
  const dropList: DroplistItem[] = tracks.map((a) => {
    const metadata = getMetadataFromCtor(a);
    return {
      name: metadata.__classname__ || '<missing classname>',
      onSelect: (e: Event) => {
        metadata.__classname__ && object.addTrack(metadata.__classname__);
      },
    };
  });

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
