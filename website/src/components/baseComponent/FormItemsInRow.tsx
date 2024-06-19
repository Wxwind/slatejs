import classNames from 'classnames';
import { ReactNode } from 'react';

interface FormItemsInRowProps {
  className?: string;
  children: ReactNode[];
}

export function FormItemsInRow(props: FormItemsInRowProps) {
  const { children, className } = props;

  const width = children.length > 0 ? 1 / children.length : 1;

  return (
    <div className={classNames('flex w-full gap-x-2', className)}>
      {children.map((node, index) => {
        return (
          <div key={index} style={{ width: `${width * 100}%` }}>
            {node}
          </div>
        );
      })}
    </div>
  );
}
