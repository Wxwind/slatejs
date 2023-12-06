import { FC } from 'react';
import { CutsceneTrackPanel } from './CutsceneTrackPanel';
import { TrackData } from './core';

interface CutsceneTrackTreeProps {
  data: TrackData[];
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackTree: FC<CutsceneTrackTreeProps> = (props) => {
  const { data, depth, paddingLeft } = props;

  return (
    <div className="pb-0.5 w-full">
      {data.map((a) => (
        <CutsceneTrackPanel key={a.id} data={a} depth={depth} paddingLeft={paddingLeft} />
      ))}
    </div>
  );
};
