import { FC, useState } from 'react';
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

  const handleChange = (n: string, v: number) => {
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec3(newValue, value) : newValue;
    onChange?.(name, scaledValue);
  };

  const handleBlur = (n: string, v: number) => {
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec3(newValue, value) : newValue;
    onBlur(name, scaledValue);
  };

  return (
    <ImmerFormItem label={label} nodeAfter={constrainable && <LockIcon value={isScaled} onChange={setIsScaled} />}>
      <FormItemsInRow>
        <ProInputNumber name="x" value={value.x} prefix="X" {...rest} onChange={handleChange} onBlur={handleBlur} />
        <ProInputNumber name="y" value={value.y} prefix="Y" {...rest} onChange={handleChange} onBlur={handleBlur} />
        <ProInputNumber name="z" value={value.z} prefix="Z" {...rest} onChange={handleChange} onBlur={handleBlur} />
      </FormItemsInRow>
    </ImmerFormItem>
  );
};
