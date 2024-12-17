import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";
import { MultipliableStat } from "../../../../helpers/powerup-manager.ts";
import { PowerupType } from "./powerupType.ts";

class DoubleSpeed extends TimedPowerup {
  get powerupType(): PowerupType {
    return PowerupType.DoubleSpeed;
  }

  applyEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.attackSpeed, 2);
    scene.hero.extra.setMultiplierStat(MultipliableStat.walkSpeed, 1.5);
  }

  removeEffect(scene: MainScene): void {
    scene.hero.extra.setMultiplierStat(MultipliableStat.attackSpeed, 1);
    scene.hero.extra.setMultiplierStat(MultipliableStat.walkSpeed, 1);
  }

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "double-speed");
    this.anims.play("double-speed");
  }
}

export default DoubleSpeed;
