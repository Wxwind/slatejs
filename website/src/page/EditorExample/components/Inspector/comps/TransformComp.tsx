import { CollapseBox } from '@/components';
import { TransformCompJson, TransformComponent } from 'deer-engine';
import { ChangeEvent, FC, useEffect } from 'react';
import { useImmer } from 'use-immer';
import set from 'lodash/set';
import clone from 'lodash/clone';
import { BlurInputNumber } from '@/components/BlurInputNumber';
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
    setData(comp.toJsonObject());
  }, [comp, setData]);

  const handleValueFinish = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = Number(e.target.value) || 0;
    set(data, name, value);
    comp.updateByJson(data);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = Number(e.target.value) || 0;

    //  const newData = set(clone(data), name, value);
    setData((draft) => {
      return set(draft, name, value);
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
                value={comp.position.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="position.y"
                value={comp.position.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="position.z"
                value={comp.position.z}
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
                value={comp.rotation.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="rotation.y"
                value={comp.rotation.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="rotation.z"
                value={comp.rotation.z}
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
                value={comp.scale.x}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="scale.y"
                value={comp.scale.y}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
            <div className="max-w-1/3">
              <BlurInputNumber
                name="scale.z"
                value={comp.scale.z}
                onBlur={handleValueFinish}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>
      </div>
    </CollapseBox>
  );
};
