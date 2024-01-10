import { FC } from 'react';
import { CutsceneTrackPanel } from './CutsceneTrackPanel';
import { CutsceneTrack } from 'deer-engine';

interface CutsceneTrackTreeProps {
  object: CutsceneTrack[];
  // style
  depth: number;
  paddingLeft: number;
}

export const CutsceneTrackTree: FC<CutsceneTrackTreeProps> = (props) => {
  const { object, depth, paddingLeft } = props;

  return (
    <div className="pb-0.5 w-full">
      {object.map((a) => (
        <CutsceneTrackPanel key={a.id} object={a} depth={depth} paddingLeft={paddingLeft} />
      ))}
    </div>
  );
};
