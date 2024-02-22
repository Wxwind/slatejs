import { customEditor } from '@/decorator';
import { JsonModule, TransformClip } from 'deer-engine';
import { useEffect } from 'react';
import { Editor, EditorProps } from './Editor';
import { useDumbState, useBindSignal } from '@/hooks';

@customEditor(TransformClip)
export class TransformClipditor extends Editor {
  onEditorGUI = (props: EditorProps<TransformClip>) => {
    const { target } = props;

    // const refresh = useDumbState();
    // useBindSignal(target.signals.clipUpdated, refresh);
    // useBindSignal(target.signals.keysChanged, refresh);
    // useEffect(() => {}, []);
    console.log(JsonModule.toJsonObject(target));
    return <div className="w-full">{JsonModule.toJson(target)}</div>;
  };
}
