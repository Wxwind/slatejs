import { Entity } from '@/core';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { IDirectable } from './IDirectable';
import { ActionClip } from './ActionClip';

export interface IKeyable extends IDirectable {
  get animatedData(): AnimatedParameterCollection | undefined;
  // The target the animatedParameter attached.
  get animatedParametersTarget(): Entity | ActionClip | undefined;
}
