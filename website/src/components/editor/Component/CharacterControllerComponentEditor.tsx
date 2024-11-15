import { EditorComp, registerEditor } from '@/decorator';
import { useBindSignal } from '@/hooks';
import { useDumbState } from '@/hooks/useDumbState';
import { CharacterControllerComponent } from 'deer-engine';

const CharacterControllerComponentEditor: EditorComp<CharacterControllerComponent> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.componentUpdated, refresh);

  return <div>CharacterControllerComponent</div>;
};

registerEditor(CharacterControllerComponent, CharacterControllerComponentEditor);
