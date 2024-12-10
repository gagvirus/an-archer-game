import MainScene from "../../../../scenes/MainScene.ts";
import {Powerup} from "../Powerup.ts";
import {PowerupType} from "./powerupType.ts";

abstract class TimedPowerup extends Powerup {
  durationSeconds: number = 30;

  abstract get powerupType(): PowerupType;

  onCollected(): void {
    const scene = this.scene as MainScene;
    this.applyEffect(scene);
    scene.events.emit("powerupCollected", {type: this.powerupType});
    setTimeout(() => {
      this.removeEffect(scene);
      scene.events.emit("powerupEnded", {type: this.powerupType});
    }, this.durationSeconds * 1000);
  }

  abstract applyEffect(scene: MainScene): void;

  abstract removeEffect(scene: MainScene): void;
}

export default TimedPowerup;
