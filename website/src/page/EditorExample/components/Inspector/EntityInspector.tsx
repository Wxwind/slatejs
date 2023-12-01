import { useEngineStore } from '@/hooks';
import { ComponentInfo, deerEngine } from 'deer-engine';
import { FC, ReactNode } from 'react';
import { MeshComp, TransformComp } from './comps';

interface EntityInspectorProps {}

export const EntityInspector: FC<EntityInspectorProps> = (props) => {
  const entityInfo = useEngineStore(deerEngine.deerStore.selectedEntityInfoStore);

  const TypeToComp: (comp: ComponentInfo, entityId: string) => ReactNode = (comp, entityId) => {
    switch (comp.type) {
      case 'Mesh':
        return <MeshComp entityId={entityId} compId={comp.id} config={comp.config} />;
      case 'Transform':
        return <TransformComp entityId={entityId} compId={comp.id} config={comp.config} />;

      default:
        return null;
    }
  };

  return (
    entityInfo && (
      <div>
        <div className="p-3 bg-blue-200">{entityInfo.name}</div>
        <div className="flex flex-col gap-y-2 py-2">
          {entityInfo.components.map((comp) => {
            return <div key={comp.id}>{TypeToComp(comp, entityInfo.id)}</div>;
          })}
        </div>
      </div>
    )
  );
};
