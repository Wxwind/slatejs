import { Shape } from '@/types';

export interface BaseStyleProps {
  zIndex?: number;
  visible?: boolean;

  opacity?: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

export interface DisplayObjectConfig<StyleProps extends BaseStyleProps = BaseStyleProps> {
  id: string;
  name: string;
  type: Shape;
  style: StyleProps;
}
