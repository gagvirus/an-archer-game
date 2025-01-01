import MainScene from "../../../../scenes/MainScene.ts";
import { Powerup } from "../Powerup.ts";
import { PowerupType } from "./powerupType.ts";
import { Scene } from "phaser";

const DURATION_SECONDS = 30;

abstract class TimedPowerup extends Powerup {
  startedAt?: number;
  remainingDurationSeconds?: number;
  private timeout: number;

  protected constructor(scene: Scene, x: number, y: number, name: string) {
    super(scene, x, y, name);
    (this.scene as MainScene).events
      .on("GamePaused", () => {
        if (this.startedAt) {
          const timeElapsed = (Date.now() - this.startedAt) / 1000;
          this.remainingDurationSeconds = DURATION_SECONDS - timeElapsed;
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

  abstract get powerupType(): PowerupType;

  applyEffect(scene: MainScene): void {
    scene.hero.attributes.setPowerupActive(this.powerupType, true);
  }

  removeEffect(scene: MainScene): void {
    scene.hero.attributes.setPowerupActive(this.powerupType, false);
  }

  onCollected(): void {
    const scene = this.scene as MainScene;
    this.applyEffect(scene);
    scene.events.emit("powerupCollected", { type: this.powerupType });
    this.timeout = this.setPowerupTimeout(scene, DURATION_SECONDS * 1000);
  }

  private setPowerupTimeout(scene: MainScene, milliseconds: number) {
    this.startedAt = Date.now() - (DURATION_SECONDS * 1000 - milliseconds);
    return setTimeout(() => {
      this.removeEffect(scene);
      this.startedAt = undefined;
      this.remainingDurationSeconds = undefined;
      scene.events.emit("powerupEnded", { type: this.powerupType });
    }, milliseconds);
  }
}

export default TimedPowerup;
