import Freeze from "./Freeze.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Group = Phaser.Physics.Arcade.Group;
import Barrage from "./Barrage.ts";
import { ActiveSkill, SkillAccessors } from "./utils.ts";

class SkillsManager implements SkillAccessors {
  readonly freeze: Freeze;
  readonly barrage: Barrage;
  constructor(scene: AbstractGameplayScene, targets: Group) {
    this.freeze = new Freeze(scene, targets);
    this.barrage = new Barrage(scene, targets);
  }

  activateSkill(skill: ActiveSkill) {
    const callback = skill.callback;
    this[callback].activate();
  }

  update() {
    this.freeze.update();
    this.barrage.update();
  }
}

export default SkillsManager;
