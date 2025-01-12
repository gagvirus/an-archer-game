import AbstractSkill from "./abstract-skill.ts";

export enum ActiveSkillKey {
  fireball = "1",
  freeze = "3",
  barrage = "4",
}

export enum SkillsRef {
  fireball = "fireball",
  freeze = "freeze",
  barrage = "barrage",
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
    icon: "cold",
    reference: SkillsRef.freeze,
    key: ActiveSkillKey.freeze,
    description: "Freeze all enemies in a circle",
  },
  {
    icon: "arrows-valley",
    reference: SkillsRef.barrage,
    key: ActiveSkillKey.barrage,
    description: "Fire deadly barrage of arrows all around You",
  },
];
