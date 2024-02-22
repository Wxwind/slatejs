import { customEditor } from '@/decorator';
import { JsonModule, AnimationClip } from 'deer-engine';
import { Editor, EditorProps } from './Editor';
import { FC } from 'react';

const AnimationClipEditorComp: FC<EditorProps<AnimationClip>> = (props) => {
  const { target } = props;

  return <div className="w-full">{JsonModule.toJson(target)}</div>;
};

@customEditor(AnimationClip)
export class AnimationClipditor extends Editor {
  onEditorGUI = (props: EditorProps<AnimationClip>) => <AnimationClipEditorComp {...props} />;
}
