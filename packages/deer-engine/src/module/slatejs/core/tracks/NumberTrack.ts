import { IDirectable } from '../IDirectable';
import { PropertyTrack } from './PropertyTrack';

export class NumberTrack extends PropertyTrack {
  protected _type = 'Property' as const;

  get name(): string {
    return 'Property';
  }
}
