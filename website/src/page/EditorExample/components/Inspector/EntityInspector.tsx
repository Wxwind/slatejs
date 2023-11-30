import { useEngineStore } from '@/hooks';
import { ComponentInfo, deerEngine } from 'deer-engine';
import { FC, ReactNode } from 'react';
import { MeshComp, TransformComp } from './comps';

interface EntityInspectorProps {}

export const EntityInspector: FC<EntityInspectorProps> = (props) => {
  const entityInfo = useEngineStore(deerEngine.deerStore.selectedEntityInfoStore);

  const TypeToComp: (comp: ComponentInfo) => ReactNode = (comp) => {
    switch (comp.type) {
      case 'Mesh':
        return <MeshComp config={comp.config} />;
      case 'Transform':
        return <TransformComp config={comp.config} />;

      default:
        return null;
    }
  };

  return (
    entityInfo && (
      <div>
        <div className="p-3">{entityInfo.name}</div>
        <div className="flex flex-col gap-y-2">
          {entityInfo.components.map((comp) => {
            return TypeToComp(comp);
          })}
        </div>
      </div>
    )
  );
};
