import MainScene from "../../../scenes/MainScene.ts";
import {Powerup} from "../powerup/Powerup.ts";

abstract class TimedPowerup extends Powerup {
  durationSeconds: number = 30;

  onCollected(): void {
    const scene = this.scene as MainScene;
    this.applyEffect(scene);
    scene.events.emit("powerupCollected");
    setTimeout(() => {
      this.removeEffect(scene);
      scene.events.emit("powerupEnded");
    }, this.durationSeconds * 1000);
  }

  abstract applyEffect(scene: MainScene): void;

  abstract removeEffect(scene: MainScene): void;
}

export default TimedPowerup;
