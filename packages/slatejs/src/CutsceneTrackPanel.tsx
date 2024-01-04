import { FC } from 'react';
import { CutsceneTrack } from './core';
import { useBindSignal, useDumbState } from './hooks';

interface CutsceneTrackPanelProps {
  object: CutsceneTrack;
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackPanel: FC<CutsceneTrackPanelProps> = (props) => {
  const { object, depth, paddingLeft } = props;

  const [refresh] = useDumbState();
  useBindSignal(object.signals.clipCountChanged, refresh);
  useBindSignal(object.signals.trackUpdated, refresh);

  return (
    <div className="cutscene-track-panel" style={{ paddingLeft: `${paddingLeft * depth}px` }}>
      {object.name}
    </div>
  );
};
