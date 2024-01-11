import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

interface CollapseBoxProps {
  title: ReactNode;
}

export const CollapseBox: FC<PropsWithChildren<CollapseBoxProps>> = (props) => {
  const { title, children } = props;

  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root className="w-full" open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <Collapsible.Trigger>
          <ChevronDownIcon className={classNames('text-xs transition-transform', open ? 'rotate-0' : '-rotate-90')} />
        </Collapsible.Trigger>
        <div>{title}</div>
      </div>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};
