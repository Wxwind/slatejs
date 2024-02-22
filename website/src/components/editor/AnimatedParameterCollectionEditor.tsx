import { ReactNode } from 'react';
import { AnimatedParameterCollection, JsonModule } from 'deer-engine';
import { Editor, EditorProps } from './Editor';
import { customEditor } from '@/decorator';
import { useBindSignal, useDumbState } from '@/hooks';

@customEditor(AnimatedParameterCollection)
export class AnimatedParameterCollectionEditor extends Editor {
  onEditorGUI = (props: EditorProps<AnimatedParameterCollection>) => {
    const { target } = props;

    const refresh = useDumbState();
    useBindSignal(target.signals.updated, refresh);

    return <div>{target.animatedParamArray.map((a) => JsonModule.toJson(a))}</div>;
  };
}
