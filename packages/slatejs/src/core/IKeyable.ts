import { Entity } from 'deer-engine';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { IDirectable } from './IDirectable';
import { ActionClip } from './ActionClip';

export interface IKeyable extends IDirectable {
  get animatedData(): AnimatedParameterCollection | undefined;
  get animatedParameterTarget(): Entity | ActionClip;
}
