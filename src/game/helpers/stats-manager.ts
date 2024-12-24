import { ChildStat, CoreStat, StatType } from "./stats.ts";
import { Attribute } from "../stats/attributes.ts";

export interface IStat {
  label: string;
  prop: string;
  description?: string;
}

export interface IChildStat extends IStat {
  prop: ChildStat;
  icon?: string;
  description?: string;
  attributes: IAttribute[];
}

export interface IAttribute extends IStat {
  prop: Attribute;
  type: StatType;
  icon?: string;
}

export interface ICoreStat extends IStat {
  prop: CoreStat;
  stats: IChildStat[];
  hotkey: string;
  icon: string;
  colors: [number, number, number];
}
