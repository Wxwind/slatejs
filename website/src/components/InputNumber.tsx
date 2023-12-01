import classNames from 'classnames';
import React, { FC } from 'react';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputNumber: FC<InputNumberProps> = (props) => {
  const { className, onPressEnter, onKeyDown, ...otherProps } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e);
    }
    onKeyDown?.(e);
  };

  return <input className={classNames(className, 'w-full')} onKeyDown={handleKeyDown} {...otherProps} />;
};
