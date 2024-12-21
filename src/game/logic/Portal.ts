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
  private readonly DISTANCE_TO_ACTIVATE = 50;
  private activatingTimeout?: number;
  private deactivatingTimeout?: number;
  private heroInPortal: boolean = false;
  private enterPrompt: Phaser.GameObjects.Sprite;

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

    this.enterPrompt = this.scene.add.sprite(x, y - 50, "input", "enter-white");
    this.enterPrompt.setVisible(false);
  }

  onHeroEnterPortal() {
    if (![PortalState.activating, PortalState.active].includes(this.state)) {
      this.state = PortalState.activating;
      this.anims.play("portal-activate");
      if (this.deactivatingTimeout) {
        clearTimeout(this.deactivatingTimeout);
        this.deactivatingTimeout = undefined;
      }
      this.activatingTimeout = setTimeout(() => {
        this.state = PortalState.active;
        this.enterPrompt.setVisible(true);
        this.scene.children.bringToTop(this.enterPrompt);
      }, this.anims.animationManager.get("portal-activate").duration);
    }
  }

  onHeroLeavePortal() {
    if (![PortalState.idle, PortalState.activating].includes(this.state)) {
      this.state = PortalState.deactivating;
      this.anims.play("portal-deactivate");
      if (this.activatingTimeout) {
        clearTimeout(this.activatingTimeout);
        this.activatingTimeout = undefined;
      }
      this.deactivatingTimeout = setTimeout(() => {
        this.state = PortalState.idle;
        this.anims.play("portal-idle");
        this.enterPrompt.setVisible(true);
        this.scene.children.bringToTop(this.enterPrompt);
      }, this.anims.animationManager.get("portal-deactivate").duration);
    }
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
    const withinBounds = distanceToHero <= this.DISTANCE_TO_ACTIVATE;
    const enteredThePortal = withinBounds;
    const leftThePortal = this.heroInPortal && !withinBounds;
    if (enteredThePortal) {
      this.heroInPortal = true;
      this.onHeroEnterPortal();
    }
    if (leftThePortal) {
      this.heroInPortal = false;
      this.onHeroLeavePortal();
    }
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = PortalState.disabled;
      this.anims.play("portal-disabled");
      this.enterPrompt.setVisible(false);
    } else {
      this.state = PortalState.idle;
      this.anims.play("portal-idle");
    }
  }
}

export default Portal;
