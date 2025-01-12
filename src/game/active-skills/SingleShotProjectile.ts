import AbstractSkill from "./abstract-skill.ts";
import Enemy from "../game-objects/Enemy.ts";
import { randomChance } from "../helpers/random-helper.ts";
import TargetedProjectile from "../game-objects/TargetedProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import Group = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;

class SingleShotProjectile extends AbstractSkill {
  private arrows: Phaser.GameObjects.Group;
  constructor(scene: AbstractGameplayScene, targets: Group) {
    super(scene, targets);

    this.arrows = scene.add.group();
  }

  activate(): void {
    const nearestTarget = this.nearestTarget;
    if (nearestTarget) {
      this.arrows.add(this.shootProjectileAtTarget(nearestTarget));
    }
  }

  update(): void {
    this.arrows.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedProjectile).update();
    });
  }

  private shootProjectileAtTarget(target: Enemy) {
    let attackDamage = this.hero.attackable.attackDamage;

    const isCritical = randomChance(this.hero.attributes.criticalChance);
    if (isCritical) {
      attackDamage *= this.hero.attributes.criticalAmount;
    }
    target.soonToBeHealth -= attackDamage;
    const arrow = new TargetedProjectile(
      this.scene,
      this.hero.x,
      this.hero.y,
      target,
      target.attackable,
      500,
      this.hero.attackable,
      attackDamage,
      isCritical,
    );
    this.scene.add.existing(arrow);
    return arrow;
  }
}

export default SingleShotProjectile;
