import { FC } from 'react';
import { CutsceneTrack } from 'deer-engine';
import { useBindSignal, useDumbState } from '@/hooks';

interface CutsceneTrackPanelProps {
  object: CutsceneTrack;
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackPanel: FC<CutsceneTrackPanelProps> = (props) => {
  const { object, depth, paddingLeft } = props;

  const refresh = useDumbState();
  useBindSignal(object.signals.clipCountChanged, refresh);
  useBindSignal(object.signals.trackUpdated, refresh);

  return (
    <div className="h-8 flex items-center" style={{ paddingLeft: `${paddingLeft * depth}px` }}>
      {object.name}
    </div>
  );
};
