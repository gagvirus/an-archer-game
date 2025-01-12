import AbstractSkill from "./abstract-skill.ts";
import Enemy from "../game-objects/Enemy.ts";
import { randomChance } from "../helpers/random-helper.ts";
import TargetedProjectile from "../game-objects/TargetedProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;

abstract class SingleShotProjectile extends AbstractSkill {
  private projectiles: Phaser.GameObjects.Group;
  private type: ProjectileType;
  constructor(
    scene: AbstractGameplayScene,
    targets: Group,
    type: ProjectileType = ProjectileType.arrow,
  ) {
    super(scene, targets);
    this.type = type;

    this.projectiles = scene.add.group();
  }

  protected abstract get damageMultiplier(): number;

  activate(): void {
    const nearestTarget = this.nearestTarget;
    if (nearestTarget) {
      this.projectiles.add(this.shootProjectileAtTarget(nearestTarget));
    }
  }

  update(): void {
    this.projectiles.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedProjectile).update();
    });
  }

  private shootProjectileAtTarget(target: Enemy) {
    let attackDamage =
      this.hero.attackable.attackDamage * this.damageMultiplier;

    const isCritical = randomChance(this.hero.attributes.criticalChance);
    if (isCritical) {
      attackDamage *= this.hero.attributes.criticalAmount;
    }
    target.soonToBeHealth -= attackDamage;
    const projectile = new TargetedProjectile(
      this.scene,
      this.hero.x,
      this.hero.y,
      target,
      target.attackable,
      500,
      this.hero.attackable,
      attackDamage,
      isCritical,
      this.type,
    );
    this.scene.add.existing(projectile);
    return projectile;
  }
}

export default SingleShotProjectile;
