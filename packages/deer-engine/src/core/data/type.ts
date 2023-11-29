type GroupOptions = { name: string } & Partial<{
  id: string;
  name: string;
  displayOrder: number;
  style: string;
}>;

export type IPropertyOptions = {
  type?: string;
  displayName?: string;
  tooltip?: string;
  group?: string | GroupOptions;
};
