import { CollapseBox } from '@/components';
import { TransformCompJson, deerEngine } from 'deer-engine';
import { ChangeEvent, FC, useEffect } from 'react';
import { useImmer } from 'use-immer';
import set from 'lodash/set';
import { clone } from 'lodash';
import { BlurInputNumber } from '@/components/BlurInputNumber';

interface TransformCompProps {
  entityId: string;
  compId: string;
  config: TransformCompJson;
}

export const TransformComp: FC<TransformCompProps> = (props) => {
  const { entityId, compId, config } = props;

  const [data, setData] = useImmer<TransformCompJson>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    console.log('set new config');
    setData(config);
  }, [config, setData]);

  const handleValueFinish = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = Number(e.target.value) || 0;
    set(data, name, value);
    deerEngine.apiCenter.updateComponent(entityId, compId, {
      id: '',
      type: 'Transform',
      config: data,
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = Number(e.target.value) || 0;
    console.log('changed', name, value);
    // const newData = set(clone(data), name, value);
    // setData(newData);

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
    </CollapseBox>
  );
};
