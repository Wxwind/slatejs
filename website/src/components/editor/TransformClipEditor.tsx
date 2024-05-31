import { EditorComp, registerEditor } from '@/decorator';
import { TransformClip } from 'deer-engine';
import { useDumbState, useBindSignal } from '@/hooks';

const TransformClipEditorComp: EditorComp<TransformClip> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.clipUpdated, refresh);
  useBindSignal(target.signals.keysChanged, refresh);

  return <div className="w-full">TransformClip</div>;
};

registerEditor(TransformClip, TransformClipEditorComp);
