import Phaser from "phaser";
import Hero from "./Hero.ts";
import MainScene from "../scenes/MainScene.ts";
import { isAutoEnterPortal } from "../helpers/registry-helper.ts";

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
  private readonly enterPrompt: Phaser.GameObjects.Sprite;
  private hero: Hero;
  private readonly autoEnterPortal: boolean;
  private autoEnterTimeout: number;

  constructor(scene: MainScene, x: number, y: number, hero: Hero) {
    super(scene, x, y, "portal");
    scene.add.existing(this);
    this.state = PortalState.disabled;
    this.anims.play("portal-disabled");
    this.autoEnterPortal = isAutoEnterPortal(scene.game);
    this.hero = hero;

    scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (this.state === PortalState.active) {
          scene.nextStage();
        }
      }
    });

    this.enterPrompt = this.scene.add
      .sprite(x, y - 50, "input", "enter-white")
      .setVisible(false);
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
        if (this.isHeroWithinBounds()) {
          this.state = PortalState.active;
          this.showEnterPrompt();

          if (this.autoEnterPortal) {
            this.autoEnterTimeout = setTimeout(() => {
              (this.scene as MainScene).nextStage();
            }, 5000);
          }
        } else {
          this.state = PortalState.deactivating;
          this.anims.play("portal-deactivate");
        }

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
      this.hideEnterPrompt();
      this.deactivatingTimeout = setTimeout(() => {
        this.state = PortalState.idle;
        this.anims.play("portal-idle");
        this.scene.children.bringToTop(this.enterPrompt);
      }, this.anims.animationManager.get("portal-deactivate").duration);
    }
  }

  public update() {
    this.checkHeroIsWithinBounds();
    this.updateEnterPromptPosition();
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.state = PortalState.disabled;
      this.anims.play("portal-disabled");
      this.hideEnterPrompt();
    } else {
      this.state = PortalState.idle;
      this.anims.play("portal-idle");
    }
  }

  private isHeroWithinBounds(): boolean {
    const distanceToHero = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.hero.x,
      this.hero.y,
    );
    return distanceToHero <= this.DISTANCE_TO_ACTIVATE;
  }

  private checkHeroIsWithinBounds() {
    if (this.state === PortalState.disabled) {
      return;
    }
    const withinBounds = this.isHeroWithinBounds();
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

  private showEnterPrompt() {
    this.enterPrompt.setVisible(true).setAlpha(0);
    this.scene.tweens.add({
      targets: this.enterPrompt,
      alpha: 1,
      duration: 200,
      ease: "Power2",
    });
  }

  private hideEnterPrompt() {
    this.scene.tweens.add({
      targets: this.enterPrompt,
      alpha: 0,
      duration: 200,
      ease: "Power2",
      onComplete: () => {
        this.enterPrompt.setVisible(false).setAlpha(1);
        clearTimeout(this.autoEnterTimeout);
      },
    });
  }

  private updateEnterPromptPosition() {
    this.enterPrompt.setPosition(this.hero.x, this.hero.y - 50);
  }
}

export default Portal;
