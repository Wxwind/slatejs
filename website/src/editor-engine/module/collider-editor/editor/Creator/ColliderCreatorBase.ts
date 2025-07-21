import { FsmState } from 'deer-engine';
import { ColliderToolType } from '../../type';
import { ColliderEditor } from '../ColliderEditor';

export abstract class ColliderToolBase extends FsmState<ColliderEditor> {
  abstract readonly name: ColliderToolType;
}
