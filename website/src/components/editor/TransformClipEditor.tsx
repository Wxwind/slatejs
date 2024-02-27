import { customEditor } from '@/decorator';
import { JsonModule, TransformClip } from 'deer-engine';
import { FC } from 'react';
import { Editor, EditorProps } from './Editor';
import { useDumbState, useBindSignal } from '@/hooks';

const TransformClipEditorComp: FC<EditorProps<TransformClip>> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.clipUpdated, refresh);
  useBindSignal(target.signals.keysChanged, refresh);

  return <div className="w-full">TransformClip</div>;
};

@customEditor(TransformClip)
export class TransformClipditor extends Editor {
  onEditorGUI = (props: EditorProps<TransformClip>) => <TransformClipEditorComp {...props} />;
}
