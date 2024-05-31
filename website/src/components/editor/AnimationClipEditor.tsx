import { EditorComp, registerEditor } from '@/decorator';
import { JsonModule, AnimationClip } from 'deer-engine';

const AnimationClipEditorComp: EditorComp<AnimationClip> = (props) => {
  const { target } = props;

  return <div className="w-full">{JsonModule.toJson(target)}</div>;
};

registerEditor(AnimationClip, AnimationClipEditorComp);
