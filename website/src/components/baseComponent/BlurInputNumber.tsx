import React, { FC } from 'react';
import { isNil, isNumber } from '@/util';
import { Input, Message, InputProps } from '@arco-design/web-react';
import { calc } from '@/module/calculator';

interface BlurInputNumberProps extends Omit<InputProps, 'onChange' | 'value' | 'onBlur'> {
  precision?: number;
  precisionOnShow?: number;
  precisionOnSave?: number;
  name: string;
  value: number | string;
  min?: number;
  max?: number;
  onChange?: (name: string, value: number | undefined) => void;
  onBlur: (name: string, value: number | undefined) => void;
}

export const BlurInputNumber: FC<BlurInputNumberProps> = (props) => {
  const { precision = 2, value, name, min, max, precisionOnShow, precisionOnSave, onBlur, onChange, ...rest } = props;

  const [showValue, setShowValue] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (isNil(value)) {
      setShowValue(undefined);
      return;
    }
    let num: number | undefined = Number(value);
    if (isNaN(num)) num = 0;
    if (!isNil(num)) {
      if (precisionOnShow !== undefined && precisionOnShow >= 0) {
        const h = 10 ** precisionOnShow;
        num = Math.round(num * h) / h;
      }
    }
    setShowValue(!isNil(num) ? num?.toString() : undefined);
  }, [precisionOnShow, value]);

  const inputExprToOutputNum = (expr: string) => {
    let num: number | undefined = 0;

    if (expr === '') {
      num = undefined;
    } else {
      try {
        const res = calc(expr);
        num = res;
      } catch (e) {
        num = undefined;
      }
    }

    if (isNumber(num)) {
      num = min === undefined ? num : Math.max(min, num);
      num = max === undefined ? num : Math.min(max, num);
      if (precisionOnSave !== undefined && precisionOnSave >= 0) {
        const h = 10 ** precisionOnSave;
        num = Math.round(num * h) / h;
      }
    }

    return num;
  };

  const handleBlur = (value: string) => {
    let num = inputExprToOutputNum(value);
    if (num === undefined) setShowValue(value);
    if (isNumber(num)) {
      num = min === undefined ? num : Math.max(min, num);
      num = max === undefined ? num : Math.min(max, num);

      let showValue = num;
      if (precisionOnShow !== undefined && precisionOnShow >= 0) {
        const h = 10 ** precisionOnShow;
        showValue = Math.round(showValue * h) / h;
      }
      setShowValue(showValue.toString());

      let saveNum = num;
      if (precisionOnSave !== undefined && precisionOnSave >= 0) {
        const h = 10 ** precisionOnSave;
        saveNum = Math.round(saveNum * h) / h;
      }
      onBlur?.(name, saveNum);
    } else {
      setShowValue(undefined);
      onBlur?.(name, undefined);
    }
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
        setShowValue(value?.toString());
        // 如果setShowValue了新数字，则直接调用select()无效果
        requestAnimationFrame(() => {
          e.target.select();
        });
      }}
      onChange={(exp) => {
        setShowValue(exp);
        const value = inputExprToOutputNum(exp);
        if (value !== undefined) onChange?.(name, value);
      }}
      {...rest}
    />
  );
};
