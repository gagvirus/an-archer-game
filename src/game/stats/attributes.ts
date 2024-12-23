export type Attributes = {
  health: number;
  armor: number;
  damage: number;
  [key: string]: number; // Allow dynamic addition of attributes
};
