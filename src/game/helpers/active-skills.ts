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
}

export const ACTIVE_SKILLS_MAP: Record<ActiveSkillKey, ActiveSkill> = {
  [ActiveSkillKey.freeze]: {
    icon: "cold",
    callback: ActiveSkillCallbacks.freeze,
  },
  [ActiveSkillKey.barrage]: {
    icon: "arrows-valley",
    callback: ActiveSkillCallbacks.barrage,
  },
};
