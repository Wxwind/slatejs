import { CollapseBox } from '@/assets/components';
import { TransformCompJson, TransformComponent } from 'deer-engine';
import { ChangeEvent, FC, useEffect } from 'react';
import { useImmer } from 'use-immer';
import set from 'lodash/set';
import { BlurInputNumber } from '@/assets/components/BlurInputNumber';
import { useBindSignal, useDumbState } from '@/hooks';

interface TransformCompProps {
  comp: TransformComponent;
}

export const TransformComp: FC<TransformCompProps> = (props) => {
  const { comp } = props;

  const [data, setData] = useImmer<TransformCompJson>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  });

  const refresh = useDumbState();
  useBindSignal(comp.signals.componentUpdated, refresh);

  useEffect(() => {
    const obj = comp.toJsonObject();
    setData(obj);
  }, [comp, setData]);

  const handleValueFinish = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('value finish');
    const name = e.target.name;
    const value = Number(e.target.value) || 0;
    set(data, name, value);
    comp.updateByJson(data);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = Number(e.target.value) || 0;
    setData((draft) => {
      set(draft, name, value);
    });
  };

  return (
    <CollapseBox title="Transform">
      <div className="flex flex-col gap-y-4">
        <div className="flex">
          <div className="max-w-1/3 basis-1/3 grow-0">position</div>
          <div className="max-w-2/3 basis-2/3 flex-1 flex items-center gap-x-2">
            <div className="max-w-1/3">
              <BlurInputNumber
                name="position.x"
                value={data.position.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="position.y"
                value={data.position.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="position.z"
                value={data.position.z}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="max-w-1/3 basis-1/3 grow-0">rotation</div>
          <div className="max-w-2/3 basis-2/3 flex-1 flex items-center gap-x-2">
            <div className="max-w-1/3">
              <BlurInputNumber
                name="rotation.x"
                value={data.rotation.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="rotation.y"
                value={data.rotation.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="rotation.z"
                value={data.rotation.z}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="max-w-1/3 basis-1/3 grow-0">scale</div>
          <div className="max-w-2/3 basis-2/3 flex-1 flex items-center gap-x-2">
            <div className="max-w-1/3">
              <BlurInputNumber
                name="scale.x"
                value={data.scale.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="scale.y"
                value={data.scale.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="scale.z"
                value={data.scale.z}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          console.log(JSON.stringify(data));
        }}
      >
        aaa
      </button>
    </CollapseBox>
  );
};
