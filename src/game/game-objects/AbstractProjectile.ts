import Sprite = Phaser.Physics.Arcade.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import { addStatistic } from "../helpers/accessors.ts";
import { addLogEntry, LogEntryCategory } from "../helpers/log-utils.ts";
import { COLOR_DANGER, COLOR_WARNING } from "../helpers/colors.ts";
import { Attackable } from "../helpers/gameplayer-helper.ts";
import { showDamage } from "../helpers/text-helpers.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";

abstract class AbstractProjectile extends Sprite {
  protected owner: Attackable;
  protected attackDamage: number;
  protected isCritical: boolean;

  constructor(
    scene: AbstractGameplayScene,
    x: number,
    y: number,
    sprite: string = "arrow",
    attackDamage: number,
    isCritical: boolean,
    owner: Attackable,
  ) {
    super(scene, x, y, sprite);
    this._gamePlayScene = scene;
    this.isCritical = isCritical;
    this.attackDamage = attackDamage;
    this.owner = owner;
  }

  private _gamePlayScene: AbstractGameplayScene;

  get gamePlayScene(): AbstractGameplayScene {
    return this._gamePlayScene;
  }

  protected handleHit(target: Attackable) {
    if (this.isCritical) {
      addStatistic("criticalHits", 1);
      addLogEntry(
        ":attacker inflicted :damage CRIT on :opponent",
        {
          attacker: [this.owner.name, COLOR_WARNING],
          damage: [this.attackDamage, COLOR_DANGER],
          opponent: [target.name, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
      addStatistic("damageInflicted", this.attackDamage);
    } else {
      addStatistic("regularHits", 1);
      addLogEntry(
        `:attacker attacked :opponent for :damage DMG`,
        {
          attacker: [this.owner.name, COLOR_WARNING],
          opponent: [target.name, COLOR_DANGER],
          damage: [this.attackDamage, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
      addStatistic("damageInflicted", this.attackDamage);
    }
    target.takeDamage(this.attackDamage, (target: Attackable) => {
      this.owner.onKilledTarget(target);
      addStatistic("enemiesKilled", 1);
      addLogEntry(
        ":attacker killed :opponent",
        {
          attacker: [this.owner.name, COLOR_WARNING],
          opponent: [target.name, COLOR_DANGER],
        },
        LogEntryCategory.Combat,
      );
    });
    showDamage(
      this.scene,
      target.owner as Vector2Like,
      this.attackDamage,
      this.isCritical,
    );
    this.destroy();
  }
}

export default AbstractProjectile;