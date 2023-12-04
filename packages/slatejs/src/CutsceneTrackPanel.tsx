import { FC } from 'react';
import { Cutscene, TrackData } from '.';

interface CutsceneTrackPanelProps {
  cutscene: Cutscene;
  data: TrackData;
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackPanel: FC<CutsceneTrackPanelProps> = (props) => {
  const { cutscene, data, depth, paddingLeft } = props;
  return (
    <div className="cutscene-track-panel" style={{ paddingLeft: `${paddingLeft * depth}px` }}>
      {data.name}
    </div>
  );
};
