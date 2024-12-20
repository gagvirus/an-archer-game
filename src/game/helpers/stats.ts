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

export enum Attribute {
  baseAttackTime = "baseAttackTime",
  attackSpeedBonus = "attackSpeedBonus",
  attackRate = "attackRate",
  attacksPerSecond = "attacksPerSecond",
  damageMultiplier = "damageMultiplier",
  criticalChancePercent = "criticalChancePercent",
  criticalExtraDamageMultiplier = "criticalExtraDamageMultiplier",
  evadeChancePercent = "evadeChancePercent",
  maxHealthMultiplier = "maxHealthMultiplier",
  healthRegenPerInterval = "healthRegenPerInterval",
  healthRegenerationInterval = "healthRegenerationInterval",
  armorRatingBonus = "armorRatingBonus",
  armorRating = "armorRating",
  flatDamageReduction = "flatDamageReduction",
  percentReduction = "percentReduction",
  xpGainMultiplier = "xpGainMultiplier",
  dropChanceModifier = "dropChanceModifier",
  dropAmountModifier = "dropAmountModifier",
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
            prop: Attribute.evadeChancePercent,
            type: StatType.defensive,
          },
        ],
      },
      {
        label: "Agility",
        prop: ChildStat.agility,
        icon: "agility",
        description: "Affects attack speed",
        attributes: [
          //   attack speed
          {
            label: "Base Attack Time",
            prop: Attribute.baseAttackTime,
            type: StatType.offensive,
          },
          {
            label: "Attack Speed Bonus",
            prop: Attribute.attackSpeedBonus,
            type: StatType.offensive,
          },
          {
            label: "Attack Rate",
            prop: Attribute.attackRate,
            type: StatType.offensive,
          },
          {
            label: "Attacks Per Second",
            prop: Attribute.attacksPerSecond,
            type: StatType.offensive,
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
            prop: Attribute.criticalChancePercent,
            type: StatType.offensive,
          },
          {
            label: "Critical Damage Multiplier",
            prop: Attribute.criticalExtraDamageMultiplier,
            type: StatType.offensive,
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
            label: "Damage multiplier",
            prop: Attribute.damageMultiplier,
            type: StatType.offensive,
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
            label: "Armor Rating Bonus",
            prop: Attribute.armorRatingBonus,
            type: StatType.defensive,
          },
          {
            label: "Armor Rating",
            prop: Attribute.armorRating,
            type: StatType.defensive,
          },
          {
            label: "Flat Damage Reduction",
            prop: Attribute.flatDamageReduction,
            type: StatType.defensive,
          },
          {
            label: "Percent Damage Reduction",
            prop: Attribute.percentReduction,
            type: StatType.defensive,
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
            label: "Max Health Multiplier",
            prop: Attribute.maxHealthMultiplier,
            type: StatType.defensive,
          },
          {
            label: "Health Regen Amount",
            prop: Attribute.healthRegenPerInterval,
            type: StatType.defensive,
          },
          {
            label: "Health Regen Interval",
            prop: Attribute.healthRegenerationInterval,
            type: StatType.defensive,
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
            prop: Attribute.xpGainMultiplier,
            type: StatType.miscellaneous,
          },
        ],
      },
      {
        label: "Charisma",
        prop: ChildStat.charisma,
        icon: "hearts",
        // todo: update this when barter is implemented
        description: "Affects nothing at the moment",
        attributes: [],
      },
      {
        label: "Luck",
        prop: ChildStat.luck,
        icon: "coins-and-pouch",
        description: "Affects item drop rate and resource gain amount",
        attributes: [
          {
            label: "Drop Chance Multiplier",
            prop: Attribute.dropChanceModifier,
            type: StatType.miscellaneous,
          },
          {
            label: "Drop Amount Modifier",
            prop: Attribute.dropAmountModifier,
            type: StatType.miscellaneous,
          },
        ],
      },
    ],
  },
];

export default coreStats;
