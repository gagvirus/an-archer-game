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
import { ICoreStat } from "./stats-manager.ts";
import { Attribute } from "../stats/attributes.ts";

export enum StatType {
  offensive = "offensive",
  defensive = "defensive",
  miscellaneous = "miscellaneous",
}

export enum CoreStat {
  finesse = "finesse",
  awareness = "awareness",
  resilience = "resilience",
  thoughtfulness = "thoughtfulness",
}

export enum ChildStat {
  dexterity = "dexterity",
  agility = "agility",
  perception = "perception",
  strength = "strength",
  fortitude = "fortitude",
  endurance = "endurance",
  intelligence = "intelligence",
  charisma = "charisma",
  luck = "luck",
}

const coreStats: ICoreStat[] = [
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
        attributes: [
          //   evade
          {
            label: "Evade Chance %",
            prop: Attribute.evadeChance,
            type: StatType.defensive,
            icon: "movement",
          },
        ],
      },
      {
        label: "Agility",
        prop: ChildStat.agility,
        icon: "agility",
        description: "Affects attack speed",
        attributes: [
          {
            label: "Attacks Per Second",
            prop: Attribute.attacksPerSecond,
            type: StatType.offensive,
            icon: "arrows-valley",
          },
        ],
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
        attributes: [
          //   critical
          {
            label: "Critical Chance %",
            prop: Attribute.criticalChance,
            type: StatType.offensive,
            icon: "critical",
          },
          {
            label: "Critical Damage Multiplier",
            prop: Attribute.criticalAmount,
            type: StatType.offensive,
            icon: "critical",
          },
        ],
      },
      {
        label: "Strength",
        prop: ChildStat.strength,
        icon: "muscles",
        description: "Adds extra attack damage",
        attributes: [
          //   damage
          {
            label: "Damage",
            prop: Attribute.damage,
            type: StatType.offensive,
            icon: "fist",
          },
        ],
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
        attributes: [
          //   armor
          {
            label: "Armor Rating",
            prop: Attribute.armorRating,
            type: StatType.defensive,
            icon: "gear",
          },
          {
            label: "Flat Damage Reduction",
            prop: Attribute.flatDamageReduction,
            type: StatType.defensive,
            icon: "light-armor",
          },
          {
            label: "Percent Damage Reduction",
            prop: Attribute.percentDamageReduction,
            type: StatType.defensive,
            icon: "heavy-armor",
          },
        ],
      },
      {
        label: "Endurance",
        prop: ChildStat.endurance,
        icon: "lungs",
        description: "Affects max health & health regeneration",
        attributes: [
          //   health
          {
            label: "Max Health",
            prop: Attribute.health,
            type: StatType.defensive,
            icon: "heart",
          },
          {
            label: "Health Regen Amount",
            prop: Attribute.healthRegen,
            type: StatType.defensive,
            icon: "health-regen",
          },
        ],
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
        attributes: [
          {
            label: "XP Gain Multiplier",
            prop: Attribute.xpRate,
            type: StatType.miscellaneous,
            icon: "brain",
          },
        ],
      },
      {
        label: "Charisma",
        prop: ChildStat.charisma,
        icon: "hearts",
        // todo: update this when barter is implemented
        description: "Better selling & Buying",
        attributes: [
          {
            label: "Barter",
            prop: Attribute.barter,
            type: StatType.miscellaneous,
            icon: "chest",
          },
        ],
      },
      {
        label: "Luck",
        prop: ChildStat.luck,
        icon: "coins-and-pouch",
        description: "Affects item drop rate and resource gain amount",
        attributes: [
          {
            label: "Drop Chance Multiplier",
            prop: Attribute.dropRate,
            type: StatType.miscellaneous,
            icon: "coins-and-pouch",
          },
          {
            label: "Drop Amount Modifier",
            prop: Attribute.dropAmount,
            type: StatType.miscellaneous,
            icon: "coins-and-pouch",
          },
        ],
      },
    ],
  },
];

export default coreStats;
