import { Group, Rect } from 'react-konva';

interface BaseNodeProps {}

export function BaseNode(props: BaseNodeProps) {
  const {} = props;

  return (
    <Group>
      <Rect>BaseNode</Rect>
    </Group>
  );
}
