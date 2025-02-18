import { Component, Entity } from 'deer-engine';
import { EngineObjectProxy } from './EngineObjectProxy';
import { EditorComponent } from '../components/EditorComponent';

class EditorEntity extends EngineObjectProxy {
  create() {}

  addEditorComponent(component: { class: string }) {
    const ctor = EditorComponent.getEngineComponent(component.class);
    if (!ctor) {
      return null;
    }
    const comp = (this.engineObject as Entity).addComponent(ctor) as Component;
    return comp;
  }
}
