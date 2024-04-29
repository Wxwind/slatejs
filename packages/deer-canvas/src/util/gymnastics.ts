import { BaseStyleProps, DisplayObjectConfig } from '@/interface';

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;
export type ShapeCtor<T extends BaseStyleProps> = Partial<DisplayObjectConfig<Partial<Omit<T, 'type'>>>>;
