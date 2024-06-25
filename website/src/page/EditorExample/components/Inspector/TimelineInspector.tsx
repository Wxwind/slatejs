import { useBindSignal, useDumbState } from '@/hooks';
import { ActionClip, CutsceneEditor, NoAbstractCtor } from 'deer-engine';
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

    const Comp = getEditorRenderer(object.constructor as NoAbstractCtor);
    return <Comp target={object} />;
  };

  return (
    <div className="flex-1 w-full break-words px-2">
      <div>{getUICompFromType(selectedClip)}</div>
      <div>------------</div>
      <CurveEditor selectedClip={selectedClip} />
    </div>
  );
};
