import { CollapseBox, FormItemsInRow, ImmerFormItem } from '@/components/baseComponent';
import { JsonModule, TransformCompJson, TransformComponent } from 'deer-engine';
import { FC, useEffect } from 'react';
import { useImmer } from 'use-immer';
import set from 'lodash/set';
import { BlurInputNumber } from '@/components/baseComponent/BlurInputNumber';
import { useBindSignal } from '@/hooks';
import { EditorComp, registerEditor } from '@/decorator';

export const TransformComponentEditor: EditorComp<TransformComponent> = (props) => {
  const { target } = props;

  const [data, setData] = useImmer<TransformCompJson>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  });

  useBindSignal(target.signals.componentUpdated, () => {
    const obj = JsonModule.toJsonObject(target);
    setData(obj);
  });

  useEffect(() => {
    const obj = JsonModule.toJsonObject(target);
    setData(obj);
  }, [target, setData]);

  const handleValueFinish = (name: string, value: number | undefined) => {
    set(data, name, value);
    target.updateByJson(data);
  };

  return (
    <CollapseBox title="Transform">
      <div className="flex flex-col gap-y-4">
        <ImmerFormItem label="position">
          <FormItemsInRow>
            <BlurInputNumber name="position.x" value={data.position.x} onBlur={handleValueFinish} />
            <BlurInputNumber name="position.y" value={data.position.y} onBlur={handleValueFinish} />
            <BlurInputNumber name="position.z" value={data.position.z} onBlur={handleValueFinish} />
          </FormItemsInRow>
        </ImmerFormItem>
        <ImmerFormItem label="rotation">
          <FormItemsInRow>
            <BlurInputNumber name="rotation.x" value={data.rotation.x} onBlur={handleValueFinish} />
            <BlurInputNumber name="rotation.y" value={data.rotation.y} onBlur={handleValueFinish} />
            <BlurInputNumber name="rotation.z" value={data.rotation.z} onBlur={handleValueFinish} />
          </FormItemsInRow>
        </ImmerFormItem>
        <ImmerFormItem label="scale">
          <FormItemsInRow>
            <BlurInputNumber name="scale.x" value={data.scale.x} onBlur={handleValueFinish} />
            <BlurInputNumber name="scale.y" value={data.scale.y} onBlur={handleValueFinish} />
            <BlurInputNumber name="scale.z" value={data.scale.z} onBlur={handleValueFinish} />
          </FormItemsInRow>
        </ImmerFormItem>
      </div>
    </CollapseBox>
  );
};

registerEditor(TransformComponent, TransformComponentEditor);
