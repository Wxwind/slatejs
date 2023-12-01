import React, { FC } from 'react';
import { InputNumber } from '.';

interface BlurInputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueFinish?: () => void;
  onValueChange?: () => void;
}

export const BlurInputNumber: FC<BlurInputNumberProps> = (props) => {
  const { onValueFinish, onValueChange, ...rest } = props;

  return (
    <InputNumber
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
