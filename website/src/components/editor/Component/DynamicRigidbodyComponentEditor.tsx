import { CollapseBox } from '@/components/baseComponent';
import { EditorComp, registerEditor } from '@/decorator';
import { useBindSignal } from '@/hooks';
import { useDumbState } from '@/hooks/useDumbState';
import { DynamicRigidbodyComponent } from 'deer-engine';

const DynamicRigidbodyComponentEditorComp: EditorComp<DynamicRigidbodyComponent> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.componentUpdated, refresh);

  return (
    <CollapseBox title="Transform">
      <div className="flex flex-col gap-y-4"></div>
    </CollapseBox>
  );
};

registerEditor(DynamicRigidbodyComponent, DynamicRigidbodyComponentEditorComp);
