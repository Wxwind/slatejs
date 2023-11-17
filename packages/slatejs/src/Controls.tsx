import { FC } from 'react';
import PlaySVG from './assets/play.svg';
import PauseSVG from './assets/pause.svg';
import PrevSVG from './assets/prev.svg';
import NextSVG from './assets/next.svg';
import classnames from 'classnames';
import { Cutscene } from './core';

export interface ControlsProps {
  className?: string;
  cutscene: Cutscene;
}

export const Controls: FC<ControlsProps> = (props) => {
  const { className, cutscene } = props;
  return (
    <div className={classnames('controls', className)}>
      <div className="controls-btn">
        <img
          alt=""
          src={PrevSVG}
          onClick={() => {
            cutscene.setTime(cutscene.director.currentTime - 1);
          }}
        />
        <img
          alt=""
          src={PlaySVG}
          onClick={() => {
            cutscene.isPlaying() ? cutscene.pause() : cutscene.play();
          }}
        />
        <img
          alt=""
          src={NextSVG}
          onClick={() => {
            cutscene.setTime(cutscene.director.currentTime + 1);
          }}
        />
      </div>
    </div>
  );
};
