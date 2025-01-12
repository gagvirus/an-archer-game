import AbstractSkill from "./abstract-skill.ts";

export enum ActiveSkillKey {
  freeze = "1",
  barrage = "2",
}

export enum SkillsRef {
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
