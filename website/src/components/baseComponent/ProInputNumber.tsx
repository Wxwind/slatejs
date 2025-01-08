import React, { FC } from 'react';
import { isNil, isNumber } from '@/util';
import { Input, InputProps } from '@arco-design/web-react';
import { calc } from '@/module/calculator';

export interface ProInputNumberProps extends Omit<InputProps, 'onChange' | 'value' | 'onBlur'> {
  precisionOnShow?: number;
  precisionOnSave?: number;
  name: string;
  value: number;
  min?: number;
  max?: number;
  onChange?: (name: string, value: number) => void;
  onBlur: (name: string, value: number) => void;
}

export const ProInputNumber: FC<ProInputNumberProps> = (props) => {
  const { value, name, min, max, precisionOnShow, precisionOnSave, onBlur, onChange, onFocus, ...rest } = props;

  const [showValue, setShowValue] = React.useState<string | undefined>(undefined);
  const [isInputing, setIsInputing] = React.useState(false);

  React.useEffect(() => {
    // 如果正在输入框输入,则不受引擎数据变化影响
    if (isInputing) return;
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
        num = calc(expr);
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

  const handleBlur = (inputValue: string) => {
    let num = inputExprToOutputNum(inputValue);
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
      setShowValue(value.toString());
      onBlur?.(name, value);
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
        setIsInputing(false);
      }}
      onFocus={(e) => {
        setIsInputing(true);
        setShowValue(value?.toString());
        onFocus?.(e);
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
