import {
  HEX_COLOR_GREEN_FINESSE,
  HEX_COLOR_GREEN_FINESSE_DARK,
  HEX_COLOR_GREEN_FINESSE_DARKER,
  HEX_COLOR_RED_AWARENESS,
  HEX_COLOR_RED_AWARENESS_DARK,
  HEX_COLOR_RED_AWARENESS_DARKER,
  HEX_COLOR_RESILIENCE,
  HEX_COLOR_RESILIENCE_DARK,
  HEX_COLOR_RESILIENCE_DARKER,
  HEX_COLOR_THOUGHTFULNESS,
  HEX_COLOR_THOUGHTFULNESS_DARK,
  HEX_COLOR_THOUGHTFULNESS_DARKER,
} from "./colors.ts";
import { ChildStat, CoreStat, ICoreStat } from "./stats-manager.ts";

const stats: ICoreStat[] = [
  {
    label: "Finesse",
    prop: CoreStat.finesse,
    hotkey: "F",
    icon: "agility",
    colors: [
      HEX_COLOR_GREEN_FINESSE,
      HEX_COLOR_GREEN_FINESSE_DARK,
      HEX_COLOR_GREEN_FINESSE_DARKER,
    ],
    description: "Affects Attack speed & Evade chance",
    stats: [
      {
        label: "Dexterity",
        prop: ChildStat.dexterity,
        icon: "movement",
        description: "Adds chance to evade attacks",
      },
      {
        label: "Agility",
        prop: ChildStat.agility,
        icon: "agility",
        description: "Affects attack speed",
      },
    ],
  },
  {
    label: "Awareness",
    prop: CoreStat.awareness,
    hotkey: "A",
    icon: "muscles",
    colors: [
      HEX_COLOR_RED_AWARENESS,
      HEX_COLOR_RED_AWARENESS_DARK,
      HEX_COLOR_RED_AWARENESS_DARKER,
    ],
    description: "Affects Attack damage, Critical Chance & damage",
    stats: [
      {
        label: "Perception",
        prop: ChildStat.perception,
        icon: "visibility-range",
        description: "Affects critical chance and critical damage amount",
      },
      {
        label: "Strength",
        prop: ChildStat.strength,
        icon: "muscles",
        description: "Adds extra attack damage",
      },
    ],
  },
  {
    label: "Resilience",
    prop: CoreStat.resilience,
    hotkey: "R",
    icon: "gear",
    colors: [
      HEX_COLOR_RESILIENCE,
      HEX_COLOR_RESILIENCE_DARK,
      HEX_COLOR_RESILIENCE_DARKER,
    ],
    description: "Affects Armor rating & Max Health / Health Regen",
    stats: [
      {
        label: "Fortitude",
        prop: ChildStat.fortitude,
        icon: "medium-armor",
        description: "Adds extra armor",
      },
      {
        label: "Endurance",
        prop: ChildStat.endurance,
        icon: "lungs",
        description: "Affects max health & health regeneration",
      },
    ],
  },
  {
    label: "Thoughtfulness",
    prop: CoreStat.thoughtfulness,
    hotkey: "T",
    icon: "brain",
    colors: [
      HEX_COLOR_THOUGHTFULNESS,
      HEX_COLOR_THOUGHTFULNESS_DARK,
      HEX_COLOR_THOUGHTFULNESS_DARKER,
    ],
    description: "Affects XP Gain & Bartering & Coin Gain",
    stats: [
      {
        label: "Intelligence",
        prop: ChildStat.intelligence,
        icon: "brain",
        description: "Affects on XP gained",
      },
      {
        label: "Charisma",
        prop: ChildStat.charisma,
        icon: "hearts",
        // todo: update this when barter is implemented
        description: "Affects nothing at the moment",
      },
      {
        label: "Luck",
        prop: ChildStat.luck,
        icon: "coins-and-pouch",
        description: "Affects item drop rate and resource gain amount",
      },
    ],
  },
];

export default stats;
