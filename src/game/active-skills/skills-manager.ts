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
import SingleShotProjectile from "./SingleShotProjectile.ts";
import SingleShotArrow from "./SingleShotArrow.ts";
import Fireball from "./Fireball.ts";
import Group = Phaser.Physics.Arcade.Group;

class SkillsManager implements SkillAccessors {
  readonly commonArrow: SingleShotProjectile;
  readonly freeze: Freeze;
  readonly barrage: Barrage;
  readonly fireball: Fireball;
  constructor(scene: AbstractGameplayScene, targets: Group) {
    this.freeze = new Freeze(scene, targets);
    this.barrage = new Barrage(scene, targets);
    this.commonArrow = new SingleShotArrow(scene, targets);
    this.fireball = new Fireball(scene, targets);
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
    this.fireball.update();
  }
}

export default SkillsManager;
