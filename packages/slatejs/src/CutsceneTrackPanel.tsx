import { FC } from 'react';
import { TrackData } from './core';

interface CutsceneTrackPanelProps {
  data: TrackData;
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackPanel: FC<CutsceneTrackPanelProps> = (props) => {
  const { data, depth, paddingLeft } = props;
  return (
    <div className="cutscene-track-panel" style={{ paddingLeft: `${paddingLeft * depth}px` }}>
      {data.name}
    </div>
  );
};
