import { AnimatedParameterCollection, JsonModule } from 'deer-engine';
import { EditorComp, registerEditor } from '@/decorator';
import { useBindSignal, useDumbState } from '@/hooks';

const AnimatedParameterCollectionEditorComp: EditorComp<AnimatedParameterCollection> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.updated, refresh);

  return <div>{target.animatedParamArray.map((a) => JsonModule.toJson(a))}</div>;
};

registerEditor(AnimatedParameterCollection, AnimatedParameterCollectionEditorComp);
