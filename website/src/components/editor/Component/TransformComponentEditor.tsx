import { CollapseBox, Vector3FormItem } from '@/components/baseComponent';
import { JsonModule, TransformComponentJson, TransformComponent } from 'deer-engine';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import set from 'lodash/set';
import { useBindSignal } from '@/hooks';
import { EditorComp, registerEditor } from '@/decorator';
import { deepClone } from '@/util';

export const TransformComponentEditor: EditorComp<TransformComponent> = (props) => {
  const { target } = props;

  const [data, setData] = useImmer<TransformComponentJson>({
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

  const handleValueFinish = (name: string, value: any) => {
    const newData = deepClone(data);
    set(newData, name, value);

    target.updateByJson(newData, true);
  };

  const handleValuePreview = (name: string, value: any) => {
    // neither change the data or notify component to sync data.
    const newData = deepClone(data);
    set(newData, name, value);

    target.updateByJson(newData, false);
  };

  return (
    <CollapseBox title="Transform">
      <div className="flex flex-col gap-y-4">
        <Vector3FormItem
          label="position"
          value={data.position}
          name="position"
          suffix="m"
          onChange={handleValuePreview}
          onBlur={handleValueFinish}
        />

        <Vector3FormItem
          label="rotation"
          value={data.rotation}
          name="rotation"
          onChange={handleValuePreview}
          onBlur={handleValueFinish}
        />

        <Vector3FormItem
          constrainable
          label={'scale'}
          value={data.scale}
          name="scale"
          onChange={handleValuePreview}
          onBlur={handleValueFinish}
        />
      </div>
    </CollapseBox>
  );
};

registerEditor(TransformComponent, TransformComponentEditor);
