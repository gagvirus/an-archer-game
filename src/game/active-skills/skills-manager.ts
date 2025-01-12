import Freeze from "./Freeze.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Barrage from "./Barrage.ts";
import {
  ACTIVE_SKILLS_MAP,
  ActiveSkill,
  ActiveSkillKey,
  SkillAccessors,
  SkillsRef,
} from "./utils.ts";
import CommonArrow from "./CommonArrow.ts";
import Group = Phaser.Physics.Arcade.Group;

class SkillsManager implements SkillAccessors {
  readonly commonArrow: CommonArrow;
  readonly freeze: Freeze;
  readonly barrage: Barrage;
  constructor(scene: AbstractGameplayScene, targets: Group) {
    this.freeze = new Freeze(scene, targets);
    this.barrage = new Barrage(scene, targets);
    this.commonArrow = new CommonArrow(scene, targets);
  }

  activateSkill(skill: ActiveSkill) {
    const callback = skill.reference;
    this[callback].activate();
  }

  activateSkillByHotkey(hotkey: ActiveSkillKey) {
    const skill = this.findSkillByHotkey(hotkey);
    if (skill) {
      this.activateSkill(skill);
    }
  }

  activateSkillByRef(skillRef: SkillsRef) {
    this[skillRef].activate();
  }

  findSkillByHotkey(hotkey: ActiveSkillKey) {
    return ACTIVE_SKILLS_MAP.find((skill) => skill.key === hotkey);
  }

  update() {
    this.freeze.update();
    this.barrage.update();
    this.commonArrow.update();
  }
}

export default SkillsManager;
