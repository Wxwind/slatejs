import { FC } from 'react';
import { CutsceneTrackPanel } from './CutsceneTrackPanel';
import { Cutscene, TrackData } from './core';

interface CutsceneTrackTreeProps {
  cutscene: Cutscene;
  data: TrackData[];
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackTree: FC<CutsceneTrackTreeProps> = (props) => {
  const { cutscene, data, depth, paddingLeft } = props;

  return (
    <div className="pb-0.5 w-full">
      {data.map((a) => (
        <CutsceneTrackPanel key={a.id} cutscene={cutscene} data={a} depth={depth} paddingLeft={paddingLeft} />
      ))}
    </div>
  );
};
