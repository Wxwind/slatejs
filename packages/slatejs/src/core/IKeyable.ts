import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { IDirectable } from './IDirectable';

export interface IKeyable extends IDirectable {
  get animatedData(): AnimatedParameterCollection;
  // get animatedParameterTarget(): any;
}
