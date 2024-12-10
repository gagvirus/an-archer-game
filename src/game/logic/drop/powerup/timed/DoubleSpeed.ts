import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import {MultipliableStat} from "../../../../helpers/powerup-manager.ts";

class DoubleSpeed extends TimedPowerup {
  applyEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.attackSpeed, 2);
    scene.hero.extra.setMultiplierStat(MultipliableStat.walkSpeed, 1.5);
  }

  removeEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.attackSpeed, 1 / 2);
    scene.hero.extra.setMultiplierStat(MultipliableStat.walkSpeed, 1 / 1.5);
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-speed");
    this.anims.play("double-speed")
  }
}

export default DoubleSpeed;
