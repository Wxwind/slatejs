import { FC } from 'react';
import { Cutscene, GroupData } from '.';
import { CutsceneTrackPanel } from './CutsceneTrackPanel';
import { PlusIcon } from '@radix-ui/react-icons';

interface CutsceneGroupPanelProps {
  cutscene: Cutscene;
  data: GroupData;
}

export const CutsceneGroupPanel: FC<CutsceneGroupPanelProps> = (props) => {
  const { cutscene, data } = props;

  return (
    <div className="cutscene-group-panel">
      <div className="cutscene-group-panel-item">
        <div>{data.name}</div>
        <PlusIcon />
      </div>
      {data.children.map((a) => (
        <CutsceneTrackPanel key={a.id} cutscene={cutscene} data={a} />
      ))}
    </div>
  );
};
