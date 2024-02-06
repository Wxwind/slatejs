import { Component, Entity } from '@/core';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { IDirectable } from './IDirectable';
import { ActionClip } from './ActionClip';

export interface IKeyable extends IDirectable {
  get animatedData(): AnimatedParameterCollection | undefined;
  get animatedParametersTarget(): Entity | Component | ActionClip | undefined;
}
