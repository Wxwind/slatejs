import { AnyCtor, globalTypeMap } from 'deer-engine';
import { EngineObjectProxy } from '../core';

export class EditorComponent extends EngineObjectProxy {
  static customComponents: Record<string, AnyCtor> = {};
  static registeredComponents: Record<string, AnyCtor> = {};

  static getEngineComponent(className: string) {
    return globalTypeMap.get(className);
  }

  static registerComponent(type: string, config: any) {}
  static getRegisteredComponent(type: string) {
    return this.registeredComponents[type];
  }

  static createComponentModel(component: { className: string }) {}
}
