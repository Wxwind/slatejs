import { FC } from 'react';
import { Cutscene, GroupData } from '.';
import { CutsceneTrackPanel } from './CutsceneTrackPanel';

interface CutsceneGroupPanelProps {
  cutscene: Cutscene;
  data: GroupData;
}

export const CutsceneGroupPanel: FC<CutsceneGroupPanelProps> = (props) => {
  const { cutscene, data } = props;

  return (
    <div className="cutscene-group-panel">
      <div className="cutscene-group-panel-item">{data.name}</div>
      {data.children.map((a) => (
        <CutsceneTrackPanel key={a.id} cutscene={cutscene} data={a} />
      ))}
    </div>
  );
};
