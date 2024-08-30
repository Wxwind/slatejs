import {
  Component,
  ComponentData,
  GridHelperComponent,
  MeshComponent,
  RendererComponent,
  TransformComponent,
  CameraComponent,
  ControlComponent,
  ViewHelperComponent,
} from '@/core';
import { ModelComponent } from '@/core/component/ModelComponent';

export function deserializeComponent(data: ComponentData): Component {
  switch (data.type) {
    case 'MeshComponent': {
      const comp = new MeshComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'TransformComponent': {
      const comp = new TransformComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'CameraComponent': {
      const comp = new CameraComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'ControlComponent': {
      const comp = new ControlComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'RendererComponent': {
      const comp = new RendererComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'ViewHelperComponent': {
      const comp = new ViewHelperComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'GridHelperComponent': {
      const comp = new GridHelperComponent();
      comp.deserialize(data);
      return comp;
    }
    case 'ModelComponent': {
      const comp = new ModelComponent();
      comp.deserialize(data);
      return comp;
    }
  }
}
