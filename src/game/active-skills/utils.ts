import AbstractSkill from "./abstract-skill.ts";

export enum ActiveSkillKey {
  freeze = "1",
  barrage = "2",
}

export enum Skills {
  freeze = "freeze",
  barrage = "barrage",
}

export type SkillAccessors = {
  [K in Skills]: AbstractSkill;
};

export interface ActiveSkill {
  icon: string;
  callback: Skills;
  key: ActiveSkillKey;
  description?: string;
}

export const ACTIVE_SKILLS_MAP: Record<ActiveSkillKey, ActiveSkill> = {
  [ActiveSkillKey.freeze]: {
    icon: "cold",
    callback: Skills.freeze,
    key: ActiveSkillKey.freeze,
    description: "Freeze all enemies in a circle",
  },
  [ActiveSkillKey.barrage]: {
    icon: "arrows-valley",
    callback: Skills.barrage,
    key: ActiveSkillKey.barrage,
    description: "Fire deadly barrage of arrows all around You",
  },
};
