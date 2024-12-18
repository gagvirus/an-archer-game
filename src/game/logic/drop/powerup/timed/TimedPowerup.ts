import MainScene from "../../../../scenes/MainScene.ts";
import { Powerup } from "../Powerup.ts";
import { PowerupType } from "./powerupType.ts";
import { Scene } from "phaser";

abstract class TimedPowerup extends Powerup {
  collectedAt?: number;
  // todo: revert this after fixing the bug with powerups
  durationSeconds: number = 3;
  remainingDurationSeconds?: number;
  private timeout: number;

  abstract get powerupType(): PowerupType;

  onCollected(): void {
    const scene = this.scene as MainScene;
    this.collectedAt = Date.now();
    this.applyEffect(scene);
    scene.events.emit("powerupCollected", { type: this.powerupType });
    this.timeout = this.setPowerupTimeout(scene, this.durationSeconds * 1000);
  }

  abstract applyEffect(scene: MainScene): void;

  abstract removeEffect(scene: MainScene): void;

  private setPowerupTimeout(scene: MainScene, seconds: number) {
    return setTimeout(() => {
      this.removeEffect(scene);
      this.collectedAt = undefined;
      this.remainingDurationSeconds = undefined;
      scene.events.emit("powerupEnded", { type: this.powerupType });
    }, seconds);
  }

  protected constructor(scene: Scene, x: number, y: number, name: string) {
    super(scene, x, y, name);
    (this.scene as MainScene).events
      .on("GamePaused", () => {
        if (this.collectedAt) {
          this.remainingDurationSeconds =
            (Date.now() - this.collectedAt) / 1000;
          clearTimeout(this.timeout);
        }
      })
      .on("GameResumed", () => {
        if (this.remainingDurationSeconds) {
          this.timeout = this.setPowerupTimeout(
            scene as MainScene,
            this.remainingDurationSeconds * 1000,
          );
        }
      });
  }
}

export default TimedPowerup;
