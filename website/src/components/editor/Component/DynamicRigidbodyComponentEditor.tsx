import { CollapseBox } from '@/components/baseComponent';
import { EditorComp, registerEditor } from '@/decorator';
import { useBindSignal } from '@/hooks';
import { useDumbState } from '@/hooks/useDumbState';
import { Checkbox } from '@arco-design/web-react';
import { DynamicRigidbodyComponent } from 'deer-engine';

const DynamicRigidbodyComponentEditorComp: EditorComp<DynamicRigidbodyComponent> = (props) => {
  const { target } = props;

  const refresh = useDumbState();
  useBindSignal(target.signals.componentUpdated, refresh);

  return (
    <CollapseBox title="Dynamic Rigidbody">
      <div className="flex flex-col gap-y-4">
        <div>
          isTrigger:
          <Checkbox
            value={target._colliders[0].isTrigger}
            onChange={(value) => {
              target._colliders.forEach((a) => (a.isTrigger = value));
            }}
          />
        </div>
        <div>
          isKinematic:
          <Checkbox
            value={target.isKinematic}
            onChange={(value) => {
              target.isKinematic = value;
            }}
          />
        </div>
      </div>
    </CollapseBox>
  );
};

registerEditor(DynamicRigidbodyComponent, DynamicRigidbodyComponentEditorComp);
