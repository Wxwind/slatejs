import { Component, DeerScene, MeshComponent, TransformComponent } from 'deer-engine';
import { FC, ReactNode } from 'react';
import { MeshComp, TransformComp } from './comps';

interface EntityInspectorProps {
  scene: DeerScene | undefined;
}

export const EntityInspector: FC<EntityInspectorProps> = (props) => {
  const { scene } = props;
  const selectedEntity = scene?.entityManager.selectedEntity;
  const TypeToComp: (comp: Component, entityId: string) => ReactNode = (comp, entityId) => {
    switch (comp.type) {
      case 'Mesh':
        return <MeshComp comp={comp as MeshComponent} />;
      case 'Transform':
        return <TransformComp comp={comp as TransformComponent} />;

      default:
        return null;
    }
  };

  return (
    selectedEntity && (
      <div>
        <div className="p-3 bg-blue-200">{selectedEntity.name}</div>
        <div className="flex flex-col gap-y-2 py-2">
          {selectedEntity.getCompArray().map((comp) => {
            return <div key={comp.id}>{TypeToComp(comp, selectedEntity.id)}</div>;
          })}
        </div>
      </div>
    )
  );
};
