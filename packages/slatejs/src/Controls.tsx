import { FC } from 'react';
import PlaySVG from './assets/play.svg';
import PauseSVG from './assets/pause.svg';
import PrevSVG from './assets/prev.svg';
import NextSVG from './assets/next.svg';

export interface ControlsProps {}

const Controls: FC<ControlsProps> = (props) => {
  const {} = props;
  return (
    <div className="controls">
      <div className="controls-btn">
        <img alt="" src={PrevSVG} />
        <img alt="" src={PlaySVG} />
        <img alt="" src={NextSVG} />
      </div>
    </div>
  );
};

export default Controls;
