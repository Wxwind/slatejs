import { Component, ComponentData, MeshComponent, RendererComponent, TransformComponent } from '@/core';
import { CameraComponent } from '@/core/component/scene/CameraComponent';
import { ControlComponent } from '@/core/component/scene/ControlComponent';
import { ViewHelperComponent } from '@/core/component/scene/ViewHelperComponent';

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
  }
}
