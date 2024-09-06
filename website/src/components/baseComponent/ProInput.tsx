import React, { FC } from 'react';
import { Input, InputProps } from '@arco-design/web-react';

export interface ProInputProps extends Omit<InputProps, 'onChange' | 'value' | 'onBlur'> {
  name: string;
  value: string | undefined;
  onChange?: (name: string, value: string) => void;
  onBlur: (name: string, value: string) => void;
}

export const ProInput: FC<ProInputProps> = (props) => {
  const { value, name, onBlur, onChange, ...rest } = props;

  const [showValue, setShowValue] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setShowValue(value);
  }, [value]);

  const handleBlur = (inputValue: string) => {
    onBlur?.(name, inputValue);
  };

  return (
    <Input
      size="small"
      autoComplete="off"
      name={name}
      value={showValue}
      onPressEnter={(event) => {
        const e = event as React.KeyboardEvent<HTMLElement>;
        if (e.key === 'Enter') {
          (e.target as HTMLElement).blur();
        }
      }}
      onBlur={(e) => {
        handleBlur(e.target.value);
      }}
      onFocus={(e) => {
        e.target.select();
      }}
      onChange={(exp) => {
        setShowValue(exp);
        if (value !== undefined) onChange?.(name, value);
      }}
      {...rest}
    />
  );
};
