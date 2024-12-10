import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import {MultipliableStat} from "../../../../helpers/powerup-manager.ts";

class DoubleDamage extends TimedPowerup {
  applyEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.damage, 2);
  }

  removeEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.damage, 1);
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-damage");
    this.anims.play("double-damage")
  }
}

export default DoubleDamage;
