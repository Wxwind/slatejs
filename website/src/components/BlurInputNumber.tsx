import React, { FC } from 'react';
import { InputNumber } from './InputNumber';
import { isNil } from '@/util';

interface BlurInputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  precision?: number;
  onValueFinish?: () => void;
  onValueChange?: () => void;
}

export const BlurInputNumber: FC<BlurInputNumberProps> = (props) => {
  const { precision, onValueFinish, onValueChange, ...rest } = props;

  return (
    <InputNumber
      precision={precision}
      onPressEnter={(e) => {
        e.currentTarget.blur();
        onValueFinish?.();
      }}
      onBlur={onValueFinish}
      onChange={onValueChange}
      {...rest}
    />
  );
};
