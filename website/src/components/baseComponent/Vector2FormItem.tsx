import { FC, useRef, useState } from 'react';
import { ProInputNumber, ProInputNumberProps } from './ProInputNumber';
import { FormItemsInRow } from './FormItemsInRow';
import { IVector2 } from 'deer-engine';
import { set } from 'lodash-es';
import { ImmerFormItem } from './ImmerFormItem';
import { LockIcon } from './LockIcon';
import { toScaledVec2 } from '@/util';

interface Vector2FormItemProps extends Omit<ProInputNumberProps, 'onChange' | 'value' | 'onBlur' | 'prefix'> {
  label: string;
  value: IVector2;
  constraintScale?: boolean;
  prefix?: [string, string];
  onChange?: (name: string, value: IVector2 | undefined) => void;
  onBlur: (name: string, value: IVector2 | undefined) => void;
}

export const Vector2FormItem: FC<Vector2FormItemProps> = (props) => {
  const { label, value, constraintScale, prefix, name, onBlur, onChange, ...rest } = props;

  const [isScaled, setIsScaled] = useState(false);
  const originVector2Ref = useRef<IVector2 | undefined>(undefined);

  const handleChange = (n: string, v: number) => {
    const value = originVector2Ref.current;
    if (!value) return;
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec2(newValue, value) : newValue;
    onChange?.(name, scaledValue);
  };

  const handleBlur = (n: string, v: number) => {
    const value = originVector2Ref.current;
    if (!value) return;
    const newValue = { ...value };
    set(newValue, n, v);
    const scaledValue = isScaled ? toScaledVec2(newValue, value) : newValue;
    onBlur(name, scaledValue);
  };

  const handleStartInput = () => {
    originVector2Ref.current = value;
  };

  const handleEndInput = (n: string, v: number) => {
    handleBlur(n, v);
    originVector2Ref.current = undefined;
  };

  return (
    <ImmerFormItem label={label} nodeAfter={constraintScale && <LockIcon value={isScaled} onChange={setIsScaled} />}>
      <FormItemsInRow>
        <ProInputNumber
          name="x"
          value={value.x}
          prefix={prefix?.[0]}
          {...rest}
          onFocus={handleStartInput}
          onChange={handleChange}
          onBlur={handleEndInput}
        />
        <ProInputNumber
          name="y"
          value={value.y}
          prefix={prefix?.[1]}
          {...rest}
          onFocus={handleStartInput}
          onChange={handleChange}
          onBlur={handleEndInput}
        />
      </FormItemsInRow>
    </ImmerFormItem>
  );
};
