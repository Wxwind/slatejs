import { Component, ComponentData, MeshComponent, TransformComponent, Entity } from '@/core';
import { CameraComponent } from '@/core/component/CameraComponent';
import { ModelComponent } from '@/core/component/ModelComponent';

export function deserializeComponent(data: ComponentData, entity: Entity): Component {
  switch (data.type) {
    case 'MeshComponent': {
      const comp = new MeshComponent(entity);
      comp.deserialize(data);
      return comp;
    }
    case 'TransformComponent': {
      const comp = new TransformComponent(entity);
      comp.deserialize(data);
      return comp;
    }
    case 'CameraComponent': {
      const comp = new CameraComponent(entity);
      comp.deserialize(data);
      return comp;
    }
    case 'ModelComponent': {
      const comp = new ModelComponent(entity);
      comp.deserialize(data);
      return comp;
    }
  }

  throw new Error(`unknown type ${data.type}`);
}
