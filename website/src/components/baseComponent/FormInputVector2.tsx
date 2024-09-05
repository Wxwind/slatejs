import { FC, useState } from 'react';
import { ProInputNumber, ProInputNumberProps } from './ProInputNumber';
import { FormItemsInRow } from './FormItemsInRow';
import { FVector2 } from 'deer-engine';
import { set } from 'lodash';
import { ImmerFormItem } from './ImmerFormItem';
import { LockIcon } from './LockIcon';
import { toScaledVec2 } from '@/util';

interface ProInputVector2Props extends Omit<ProInputNumberProps, 'onChange' | 'value' | 'onBlur' | 'prefix'> {
  label: string;
  value: FVector2;
  constraintScale?: boolean;
  prefix?: [string, string];
  onChange?: (name: string, value: FVector2 | undefined) => void;
  onBlur: (name: string, value: FVector2 | undefined) => void;
}

export const ProInputVector2: FC<ProInputVector2Props> = (props) => {
  const { label, value, constraintScale, prefix, name, onBlur, onChange, ...rest } = props;

  const [isScaled, setIsScaled] = useState(false);

  const handleChange = (n: string, v: number) => {
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec2(newValue, value) : newValue;
    onChange?.(name, scaledValue);
  };

  const handleBlur = (n: string, v: number) => {
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec2(newValue, value) : newValue;
    onBlur(name, scaledValue);
  };

  return (
    <ImmerFormItem label={label} nodeAfter={constraintScale && <LockIcon value={isScaled} onChange={setIsScaled} />}>
      <FormItemsInRow>
        <ProInputNumber
          name="x"
          value={value.x}
          prefix={prefix?.[0]}
          {...rest}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <ProInputNumber
          name="y"
          value={value.y}
          prefix={prefix?.[1]}
          {...rest}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormItemsInRow>
    </ImmerFormItem>
  );
};
