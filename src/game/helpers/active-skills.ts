export enum ActiveSkillKey {
  freeze = "1",
  barrage = "2",
}

export enum ActiveSkillCallbacks {
  freeze = "freeze",
  barrage = "barrage",
}

export const ACTIVE_SKILLS_MAP: Record<ActiveSkillKey, ActiveSkillCallbacks> = {
  [ActiveSkillKey.freeze]: ActiveSkillCallbacks.freeze,
  [ActiveSkillKey.barrage]: ActiveSkillCallbacks.barrage,
};
