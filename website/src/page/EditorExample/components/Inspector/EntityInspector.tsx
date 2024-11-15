import { Component, DeerScene, NoAbstractCtor } from 'deer-engine';
import { FC, ReactNode } from 'react';
import { useBindSignal, useDumbState } from '@/hooks';
import { getEditorRenderer } from '@/decorator';
import { DefaultEditor } from '@/components/editor/DefaultEditor';

interface EntityInspectorProps {
  scene: DeerScene | undefined;
}

export const EntityInspector: FC<EntityInspectorProps> = (props) => {
  const { scene } = props;
  const selectedEntity = scene?.entityManager.selectedEntity;

  const refresh = useDumbState();
  useBindSignal(scene?.entityManager.signals.entitySelected, refresh);

  const TypeToComp: (comp: Component) => ReactNode = (comp) => {
    const Comp = getEditorRenderer(comp.constructor as NoAbstractCtor);

    return (
      <div>
        <Comp target={comp} />
      </div>
    );
  };

  return (
    selectedEntity && (
      <div>
        <div className="p-3 bg-blue-200">{selectedEntity.name}</div>
        <div className="flex flex-col gap-y-2 py-2">
          {selectedEntity.getCompArray().map((comp) => {
            return <div key={comp.id}>{TypeToComp(comp)}</div>;
          })}
        </div>
      </div>
    )
  );
};
