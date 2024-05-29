import { useBindSignal, useDumbState } from '@/hooks';
import { isNil } from '@/util';
import { ActionClip, CutsceneEditor, globalTypeMap } from 'deer-engine';
import { FC } from 'react';
import { getEditorRenderer } from '@/decorator';
import { CurveEditor } from './components';

interface TimelineInspectorProps {
  cutsceneEditor: CutsceneEditor;
}

export const TimelineInspector: FC<TimelineInspectorProps> = (props) => {
  const { cutsceneEditor } = props;

  const selectedClip = cutsceneEditor.selectedClip;
  const refresh = useDumbState();
  useBindSignal(cutsceneEditor.signals.selectedClipUpdated, refresh);
  console.log('selectedClip', selectedClip);

  const getUICompFromType = (object: ActionClip | undefined) => {
    if (!object) return <div>not select any clip.</div>;
    const ctor = globalTypeMap.get(object.constructor.name);
    if (isNil(ctor))
      return (
        <div>
          {object?.type}----{object.constructor.name}
        </div>
      );
    const comp = getEditorRenderer(ctor);
    return <div>{comp({ target: object })}</div>;
  };

  return (
    <div className="flex-1 w-full break-words px-2">
      <div>{getUICompFromType(selectedClip)}</div>
      <div>------------</div>
      <CurveEditor selectedClip={selectedClip} />
    </div>
  );
};
