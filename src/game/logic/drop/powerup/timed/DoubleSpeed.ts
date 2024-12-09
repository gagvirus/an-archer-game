import MainScene from "../../../../scenes/MainScene.ts";
import TimedPowerup from "./TimedPowerup.ts";

class DoubleSpeed extends TimedPowerup {
  applyEffect(scene: MainScene): void {
    scene.hero.extra.multiplyAttackSpeed(2);
    scene.hero.extra.multiplyWalkSpeed(1.5);
  }
  removeEffect(scene: MainScene): void {
    scene.hero.extra.multiplyAttackSpeed(1 / 2);
    scene.hero.extra.multiplyWalkSpeed(1 / 1.5);
  }

  constructor(scene: MainScene, x: number, y: number, durationSeconds: number = 30) {
    super(scene, x, y, "double-speed");
    this.anims.play("double-speed")
    this.durationSeconds = durationSeconds;
  }
}

export default DoubleSpeed;
