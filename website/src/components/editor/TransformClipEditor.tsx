import { customEditor } from '@/decorator';
import { JsonModule, TransformClip } from 'deer-engine';
import { FC, useEffect } from 'react';
import { Editor, EditorProps } from './Editor';
import { useDumbState, useBindSignal } from '@/hooks';

const TransformClipEditorComp: FC<EditorProps<TransformClip>> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.clipUpdated, refresh);
  useBindSignal(target.signals.keysChanged, refresh);
  useEffect(() => {
    console.log('123');
  }, []);

  return <div className="w-full">{JsonModule.toJson(target)}</div>;
};

@customEditor(TransformClip)
export class TransformClipditor extends Editor {
  onEditorGUI = (props: EditorProps<TransformClip>) => <TransformClipEditorComp {...props} />;
}
