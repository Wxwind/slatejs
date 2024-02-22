import classNames from 'classnames';
import React, { FC } from 'react';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  precision?: number;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputNumber: FC<InputNumberProps> = (props) => {
  const { className, precision, value, onPressEnter, onKeyDown, ...otherProps } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e);
    }
    onKeyDown?.(e);
  };

  return <input className={classNames(className, 'w-full')} value={value} onKeyDown={handleKeyDown} {...otherProps} />;
};
