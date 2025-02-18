import { EngineObject } from 'deer-engine';

type PropertyChangeListener = (value: any, needSave: boolean) => void;

export class EngineObjectProxy {
  [key: string]: any;

  private _engineObject: EngineObject | undefined;
  public get engineObject(): EngineObject | undefined {
    return this._engineObject;
  }
  public set engineObject(v: EngineObject | undefined) {
    this._engineObject = v;
  }

  propertyChangeEventMap: Record<string, PropertyChangeListener[]> = {};
  allChangeEventArr: PropertyChangeListener[] = [];

  /** watch single property change */
  watchPropertyChange(propPath: string, callback: PropertyChangeListener) {
    const eventMap = this.propertyChangeEventMap;
    if (!eventMap[propPath]) {
      eventMap[propPath] = [];
    }
    eventMap[propPath].push(callback);
  }

  /** Watch all properties change */
  watchAllChange(callback: PropertyChangeListener) {
    this.allChangeEventArr.push(callback);
  }

  emitPropertyChange(property: string, needSave: boolean = false) {
    if (this.propertyChangeEventMap[property]) {
      this.propertyChangeEventMap[property].forEach((cb) => cb(this[property], needSave));
    }

    this.allChangeEventArr.forEach((cb) => cb(property, needSave));
  }

  emitAllChange(needSave: boolean = false) {
    for (const key in this.propertyChangeEventMap) {
      const callbacks = this.propertyChangeEventMap[key];
      callbacks.forEach((cb) => cb(key, needSave));
    }
  }
}
