import { EngineObject } from 'deer-engine';

export class EngineObjectProxy {
  _engineObject: EngineObject | undefined;

  setEngineObject(engineObject: EngineObject) {
    this._engineObject = engineObject;
  }
}
