import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import Phaser from "phaser";
import Container = Phaser.GameObjects.Container;
import Group = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;

interface Target extends GameObject {
  x: number;
  y: number;
  hasStatusEffect: (key: string) => boolean;
  addStatusEffect: (key: string, value: Sprite) => void;
  removeStatusEffect: (key: string) => void;
  speed: number;
  instanceId: string;
}

class FreezeSpell extends Container {
  private owner: Attackable;
  private frozenTargets: Group;
  private thawingTargets: Group;
  private iceList: Record<string, Sprite> = {};
  private readonly sphereRadius: number = 250;
  private readonly thawingTime: number = 2500;

  constructor(scene: AbstractGameplayScene, owner: Attackable, targets: Group) {
    const { x, y } = owner.owner;
    super(scene, x, y);
    this.owner = owner;
    this.frozenTargets = scene.physics.add.group();
    this.thawingTargets = scene.physics.add.group();
    scene.add.existing(this);

    const sphere = scene.physics.add.existing(
      scene.add.circle(0, 0, this.sphereRadius, 0x0000cc, 0.2),
    );

    scene.physics.add.overlap(
      sphere,
      targets,
      (_, target) => {
        this.handleCollision(target as Target);
      },
      undefined,
      this,
    );

    this.add(sphere);
  }

  createIce(target: Target) {
    const index = 37;
    const ice = this.scene.add.sprite(
      target.x,
      target.y,
      "effects_blue",
      index,
    );
    this.iceList[target.instanceId] = ice;
    target.speed *= 0.1;
    target.addStatusEffect("ice", ice);
  }

  removeIce(target: Target) {
    this.iceList[target.instanceId].destroy();
    delete this.iceList[target.instanceId];
    target.speed /= 0.1;
    target.removeStatusEffect("ice");
  }

  update() {
    this.setPosition(this.owner.owner.x, this.owner.owner.y);
    this.checkTargets();
  }

  private handleCollision(target: Target) {
    if (
      !target.hasStatusEffect("ice") &&
      !this.frozenTargets.contains(target) &&
      !this.thawingTargets.contains(target)
    ) {
      this.frozenTargets.add(target);
      this.createIce(target);
    }
  }

  private checkTargets() {
    this.frozenTargets.getChildren().forEach((frozenTarget: GameObject) => {
      const target = frozenTarget as Target;
      const { x, y } = target;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
      if (distance > this.sphereRadius) {
        this.frozenTargets.remove(target);
        this.thawingTargets.add(target);
        this.scene.time.delayedCall(
          this.thawingTime,
          () => {
            this.thawingTargets.remove(target);
            this.removeIce(target);
          },
          [],
          this,
        );
      }
    });
  }

  destroy() {
    this.scene.time.delayedCall(
      this.thawingTime,
      () => {
        this.frozenTargets.getChildren().forEach((target) => {
          this.thawingTargets.remove(target);
          this.removeIce(target as Target);
        });
      },
      [],
      this,
    );

    super.destroy();
  }
}

export default FreezeSpell;
