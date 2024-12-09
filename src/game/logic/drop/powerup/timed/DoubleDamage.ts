import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import {MultipliableStat} from "../../../../helpers/extra-effects.ts";

class DoubleDamage extends TimedPowerup {
  applyEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.damage, 2);
  }

  removeEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.damage, 1 / 2);
  }

  constructor(scene: MainScene, x: number, y: number, durationSeconds: number = 30) {
    super(scene, x, y, "double-damage");
    this.anims.play("double-damage")
    this.durationSeconds = durationSeconds;
  }
}

export default DoubleDamage;
