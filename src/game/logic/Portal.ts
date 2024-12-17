import Phaser from "phaser";
import Hero from "./Hero.ts";
import MainScene from "../scenes/MainScene.ts";

export class Portal extends Phaser.Physics.Arcade.Sprite {
  state: string;

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "portal");
    scene.add.existing(this);
    this.state = "disabled";
    this.anims.play("portal-disabled");

    scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (this.state === "active") {
          scene.nextStage();
        }
      }
    });
  }

  checkHeroIsWithinBounds(hero: Hero) {
    if (this.state === "disabled") {
      return;
    }
    const distanceToHero = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      hero.x,
      hero.y,
    );
    if (distanceToHero <= 50) {
      if (!["activating", "active"].includes(this.state)) {
        this.state = "activating";
        this.anims.play("portal-activate");
        this.scene.time.delayedCall(
          this.anims.animationManager.get("portal-activate").duration,
          () => {
            this.state = "active";
          },
        );
      }
    } else {
      if (!["idle", "activating"].includes(this.state)) {
        this.state = "deactivating";
        this.anims.play("portal-deactivate");
        this.scene.time.delayedCall(
          this.anims.animationManager.get("portal-deactivate").duration,
          () => {
            this.state = "idle";
            this.anims.play("portal-idle");
          },
        );
      }
    }
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = "disabled";
      this.anims.play("portal-disabled");
    } else {
      this.state = "idle";
      this.anims.play("portal-idle");
    }
  }
}

export default Portal;
