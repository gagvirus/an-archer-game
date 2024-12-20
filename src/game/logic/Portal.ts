import Phaser from "phaser";
import Hero from "./Hero.ts";
import MainScene from "../scenes/MainScene.ts";

enum PortalState {
  active,
  activating,
  disabled,
  deactivating,
  idle,
}

export class Portal extends Phaser.Physics.Arcade.Sprite {
  state: PortalState;

  constructor(scene: MainScene, x: number, y: number) {
    super(scene, x, y, "portal");
    scene.add.existing(this);
    this.state = PortalState.disabled;
    this.anims.play("portal-disabled");

    scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (this.state === PortalState.active) {
          scene.nextStage();
        }
      }
    });
  }

  checkHeroIsWithinBounds(hero: Hero) {
    if (this.state === PortalState.disabled) {
      return;
    }
    const distanceToHero = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      hero.x,
      hero.y,
    );
    if (distanceToHero <= 50) {
      if (![PortalState.activating, PortalState.active].includes(this.state)) {
        this.state = PortalState.activating;
        this.anims.play("portal-activate");
        this.scene.time.delayedCall(
          this.anims.animationManager.get("portal-activate").duration,
          () => {
            this.state = PortalState.active;
          },
        );
      }
    } else {
      if (![PortalState.idle, PortalState.activating].includes(this.state)) {
        this.state = PortalState.deactivating;
        this.anims.play("portal-deactivate");
        this.scene.time.delayedCall(
          this.anims.animationManager.get("portal-deactivate").duration,
          () => {
            this.state = PortalState.idle;
            this.anims.play("portal-idle");
          },
        );
      }
    }
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = PortalState.disabled;
      this.anims.play("portal-disabled");
    } else {
      this.state = PortalState.idle;
      this.anims.play("portal-idle");
    }
  }
}

export default Portal;
