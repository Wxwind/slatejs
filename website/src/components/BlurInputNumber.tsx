import React, { ChangeEvent, FC } from 'react';
import { InputNumber } from './InputNumber';
import { isNil } from '@/util';

interface BlurInputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  precision?: number;
  onValueFinish?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const BlurInputNumber: FC<BlurInputNumberProps> = (props) => {
  const { precision = 2, value, onValueFinish, onChange, ...rest } = props;

  let num: number | undefined = Number(value);

  if (isNaN(num)) num = undefined;
  if (!isNil(num)) {
    if (precision > 0) {
      const h = 10 ** precision;
      num = Math.round(num * h) / h;
    }
  }

  return (
    <InputNumber
      autoComplete="off"
      value={value}
      precision={precision}
      onPressEnter={(e) => {
        e.currentTarget.blur();
      }}
      onBlur={onValueFinish}
      onChange={onChange}
      {...rest}
    />
  );
};
