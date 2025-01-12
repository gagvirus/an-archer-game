import AbstractSkill from "./abstract-skill.ts";

export enum ActiveSkillKey {
  fireball = "1",
  fireBurst = "2",
  freeze = "3",
  arrowBarrage = "4",
}

export enum SkillsRef {
  fireball = "fireball",
  fireBurst = "fireBurst",
  freeze = "freeze",
  arrowBarrage = "arrowBarrage",
  commonArrow = "commonArrow",
}

export type SkillAccessors = {
  [K in SkillsRef]: AbstractSkill;
};

export interface ActiveSkill {
  icon?: string;
  reference: SkillsRef;
  key?: ActiveSkillKey;
  description?: string;
}

export const ACTIVE_SKILLS_MAP: ActiveSkill[] = [
  {
    reference: SkillsRef.commonArrow,
  },
  {
    icon: "fiery-skull",
    reference: SkillsRef.fireball,
    key: ActiveSkillKey.fireball,
    description: "Throw a devastating fireball",
  },
  {
    icon: "circle-of-fire",
    reference: SkillsRef.fireBurst,
    key: ActiveSkillKey.fireBurst,
    description: "Burst deadly fireballs all around yourself.",
  },
  {
    icon: "cold",
    reference: SkillsRef.freeze,
    key: ActiveSkillKey.freeze,
    description: "Freeze all enemies in a circle",
  },
  {
    icon: "arrows-valley",
    reference: SkillsRef.arrowBarrage,
    key: ActiveSkillKey.arrowBarrage,
    description: "Fire deadly barrage of arrows all around You",
  },
];
