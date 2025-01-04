export enum ActiveSkillKey {
  freeze = "1",
  barrage = "2",
}

export enum ActiveSkillCallbacks {
  freeze = "freeze",
  barrage = "barrage",
}

export type ActiveSkillCallbackMethods = {
  [K in ActiveSkillCallbacks]: () => void;
};

export interface ActiveSkill {
  icon: string;
  callback: ActiveSkillCallbacks;
  key: ActiveSkillKey;
  description?: string;
}

export const ACTIVE_SKILLS_MAP: Record<ActiveSkillKey, ActiveSkill> = {
  [ActiveSkillKey.freeze]: {
    icon: "cold",
    callback: ActiveSkillCallbacks.freeze,
    key: ActiveSkillKey.freeze,
    description: "Freeze all enemies in a circle",
  },
  [ActiveSkillKey.barrage]: {
    icon: "arrows-valley",
    callback: ActiveSkillCallbacks.barrage,
    key: ActiveSkillKey.barrage,
    description: "Fire deadly barrage of arrows all around You",
  },
};
