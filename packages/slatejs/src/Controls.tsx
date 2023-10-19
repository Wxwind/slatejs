import { FC } from 'react';
import PlaySVG from './assets/play.svg';
import PauseSVG from './assets/pause.svg';
import PrevSVG from './assets/prev.svg';
import NextSVG from './assets/next.svg';
import classnames from 'classnames';
import { CutScene } from './core';

export interface ControlsProps {
  className?: string;
  cutScene: CutScene;
}

const Controls: FC<ControlsProps> = (props) => {
  const { className, cutScene } = props;
  return (
    <div className={classnames('controls', className)}>
      <div className="controls-btn">
        <img
          alt=""
          src={PrevSVG}
          onClick={() => {
            cutScene.setTime(cutScene.player.currentTime - 1);
          }}
        />
        <img
          alt=""
          src={PlaySVG}
          onClick={() => {
            cutScene.isPlaying() ? cutScene.pause() : cutScene.play();
          }}
        />
        <img
          alt=""
          src={NextSVG}
          onClick={() => {
            cutScene.setTime(cutScene.player.currentTime + 1);
          }}
        />
      </div>
    </div>
  );
};

export default Controls;
