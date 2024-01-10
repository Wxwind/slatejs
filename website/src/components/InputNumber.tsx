import { isNil } from '@/util';
import classNames from 'classnames';
import React, { FC } from 'react';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  precision?: number;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputNumber: FC<InputNumberProps> = (props) => {
  const { className, precision = 2, value, onPressEnter, onKeyDown, ...otherProps } = props;

  let num: number | undefined = Number(value);

  if (isNaN(num)) num = undefined;
  if (!isNil(num)) {
    if (precision > 0) {
      const h = 10 ** precision;
      num = Math.round(num * h) / h;
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e);
    }
    onKeyDown?.(e);
  };

  return <input className={classNames(className, 'w-full')} value={num} onKeyDown={handleKeyDown} {...otherProps} />;
};
