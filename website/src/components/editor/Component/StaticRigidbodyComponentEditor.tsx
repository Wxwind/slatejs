import { EditorComp, registerEditor } from '@/decorator';
import { useBindSignal } from '@/hooks';
import { useDumbState } from '@/hooks/useDumbState';
import { StaticRigidbodyComponent } from 'deer-engine';

const StaticRigidbodyComponentEditorComp: EditorComp<StaticRigidbodyComponent> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.componentUpdated, refresh);

  return <div>StaticRigidbodyComponent</div>;
};

registerEditor(StaticRigidbodyComponent, StaticRigidbodyComponentEditorComp);
