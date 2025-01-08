import { FC, useRef, useState } from 'react';
import { ProInputNumber, ProInputNumberProps } from './ProInputNumber';
import { FormItemsInRow } from './FormItemsInRow';
import { IVector3 } from 'deer-engine';
import { set } from 'lodash';
import { ImmerFormItem } from './ImmerFormItem';
import { LockIcon } from './LockIcon';
import { toScaledVec3 } from '@/util';

interface Vector3FormItemProps extends Omit<ProInputNumberProps, 'onChange' | 'value' | 'onBlur' | 'prefix'> {
  label: string;
  value: IVector3;
  constrainable?: boolean;
  onChange?: (name: string, value: IVector3 | undefined) => void;
  onBlur: (name: string, value: IVector3 | undefined) => void;
}

export const Vector3FormItem: FC<Vector3FormItemProps> = (props) => {
  const { label, value, constrainable, name, onBlur, onChange, ...rest } = props;

  const [isScaled, setIsScaled] = useState(false);
  const originVector3Ref = useRef<IVector3 | undefined>(undefined);

  const handleChange = (n: string, v: number) => {
    const value = originVector3Ref.current;
    if (!value) return;
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec3(newValue, value) : newValue;
    onChange?.(name, scaledValue);
  };

  const handleBlur = (n: string, v: number) => {
    const value = originVector3Ref.current;
    if (!value) return;
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec3(newValue, value) : newValue;
    onBlur(name, scaledValue);
  };

  const handleStartInput = () => {
    originVector3Ref.current = value;
  };

  const handleEndInput = (n: string, v: number) => {
    handleBlur(n, v);
    originVector3Ref.current = undefined;
  };

  return (
    <ImmerFormItem label={label} nodeAfter={constrainable && <LockIcon value={isScaled} onChange={setIsScaled} />}>
      <FormItemsInRow>
        <ProInputNumber
          name="x"
          value={value.x}
          prefix="X"
          {...rest}
          onFocus={handleStartInput}
          onChange={handleChange}
          onBlur={handleEndInput}
        />
        <ProInputNumber
          name="y"
          value={value.y}
          prefix="Y"
          {...rest}
          onFocus={handleStartInput}
          onChange={handleChange}
          onBlur={handleEndInput}
        />
        <ProInputNumber
          name="z"
          value={value.z}
          prefix="Z"
          {...rest}
          onFocus={handleStartInput}
          onChange={handleChange}
          onBlur={handleEndInput}
        />
      </FormItemsInRow>
    </ImmerFormItem>
  );
};
