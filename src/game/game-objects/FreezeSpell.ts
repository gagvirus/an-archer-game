import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import Phaser from "phaser";
import Container = Phaser.GameObjects.Container;
import Group = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;
import Vector2Like = Phaser.Types.Math.Vector2Like;

class FreezeSpell extends Container {
  private owner: Attackable;
  private frozenTargets: Group;
  private thawingTargets: Group;
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
      (_, enemy) => {
        this.handleCollision(enemy as GameObject);
      },
      undefined,
      this,
    );

    this.add(sphere);
  }

  createIce(position: Vector2Like) {
    const index = 37;
    this.scene.add.sprite(position.x, position.y, "effects_blue", index);
  }

  update() {
    this.setPosition(this.owner.owner.x, this.owner.owner.y);
    this.checkTargets();
  }

  private handleCollision(target: GameObject) {
    if (
      !this.frozenTargets.contains(target) &&
      !this.thawingTargets.contains(target)
    ) {
      this.frozenTargets.add(target);
      this.createIce(target as unknown as Vector2Like);
      console.log(`freezing ${target.name}`);
    }
  }

  private checkTargets() {
    this.frozenTargets.getChildren().forEach((frozenTarget: GameObject) => {
      const { x, y } = frozenTarget as unknown as Vector2Like;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
      if (distance > this.sphereRadius) {
        this.frozenTargets.remove(frozenTarget);
        this.thawingTargets.add(frozenTarget);
        this.scene.time.delayedCall(
          this.thawingTime,
          () => {
            this.thawingTargets.remove(frozenTarget);
          },
          [],
          this,
        );
      }
    });
  }
}

export default FreezeSpell;
