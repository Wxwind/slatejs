import { Component, Entity } from '@/core';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { IDirectable } from './IDirectable';
import { ActionClip } from './ActionClip';

export interface IKeyable extends IDirectable {
  get animatedData(): AnimatedParameterCollection | undefined;
  get animatedParameterTarget(): Entity | Component | ActionClip | undefined;
}
