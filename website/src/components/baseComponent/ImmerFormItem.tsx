import { Tooltip } from '@arco-design/web-react';
import { ReactNode } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';

interface ImmerFormItemProps {
  label?: ReactNode;
  children?: ReactNode;
  tooltip?: ReactNode;
}

export function ImmerFormItem(props: ImmerFormItemProps) {
  const { label, children, tooltip } = props;

  return (
    <div className="py-1 flex">
      <div className="h-7 flex-1 overflow-ellipsis flex items-center w-1/4">
        <div className="truncate">{label}</div>
        {tooltip && (
          <Tooltip content={tooltip}>
            <BsQuestionCircle className="ml-1 text-content3" size={12} />
          </Tooltip>
        )}
      </div>

      <div className="w-3/4 pl-2">{children}</div>
    </div>
  );
}
