import AbstractSkill from "./abstract-skill.ts";
import { DirectionalProjectile } from "../game-objects/DirectionalProjectile.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import TargetedProjectile from "../game-objects/TargetedProjectile.ts";
import { ProjectileType } from "../game-objects/AbstractProjectile.ts";
import Group = Phaser.GameObjects.Group;
import ArcadeGroup = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;

abstract class Barrage extends AbstractSkill {
  private projectiles: Group;
  private readonly damageMultiplier: number;
  private readonly numberOfProjectiles: number;
  private readonly distance: number;
  private readonly projectileSpeed: number;
  private readonly hitRadius: number;
  private readonly type: ProjectileType;

  constructor(
    scene: AbstractGameplayScene,
    targets: ArcadeGroup,
    type: ProjectileType = ProjectileType.arrow,
    damageMultiplier: number = 1,
    numberOfProjectiles: number = 36,
    distance: number = 1000,
    projectileSpeed: number = 500,
    hitRadius: number = 10,
  ) {
    super(scene, targets);
    this.projectiles = scene.add.group();
    this.damageMultiplier = damageMultiplier;
    this.numberOfProjectiles = numberOfProjectiles;
    this.distance = distance;
    this.projectileSpeed = projectileSpeed;
    this.hitRadius = hitRadius;
    this.type = type;
  }

  activate() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      const angle = (360 / this.numberOfProjectiles) * i;
      const projectile = new DirectionalProjectile(
        this.scene,
        this.hero.x,
        this.hero.y,
        this.hero.attackDamage * this.damageMultiplier,
        false,
        this.hero.attackable,
        this.projectileSpeed,
        this.hitRadius,
        angle,
        this.distance,
        this.targets,
        this.type,
      );
      this.projectiles.add(projectile);
    }
  }

  update() {
    this.projectiles.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedProjectile).update();
    });
  }
}

export default Barrage;
