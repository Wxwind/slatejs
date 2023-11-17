import { FC } from 'react';
import { Cutscene, TrackData } from '.';

interface CutsceneTrackPanelProps {
  cutscene: Cutscene;
  data: TrackData;
}

export const CutsceneTrackPanel: FC<CutsceneTrackPanelProps> = (props) => {
  const { cutscene, data } = props;
  return <div className="cutscene-track-panel">{data.name}</div>;
};
