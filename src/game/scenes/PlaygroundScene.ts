import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";
import { EnemyDef } from "../game-objects/enemies.ts";
import { DirectionalArrow } from "../game-objects/DirectionalArrow.ts";
import { randomChance } from "../helpers/random-helper.ts";
import TargetedArrow from "../game-objects/TargetedArrow.ts";
import Group = Phaser.GameObjects.Group;
import GameObject = Phaser.GameObjects.GameObject;

class PlaygroundScene extends AbstractGameplayScene {
  private arrows: Group;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    super.create();
    this.createDummyEnemy();
    this.arrows = this.add.group();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.arrows.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedArrow).update();
    });
  }

  protected registerEventListeners() {
    super.registerEventListeners();
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["1", "2"].includes(event.key)) {
        const skillsMap = {
          "1": "freeze",
          "2": "barrage",
        };
        const eventKey = event.key as "1" | "2";
        const skill = skillsMap[eventKey] as "freeze" | "barrage";
        this[skill]();
      }
    });
  }

  private freeze() {
    this.barrage();
  }

  private createDummyEnemy() {
    const dummyDef: EnemyDef = {
      attackDamage: 0,
      attackRange: 0,
      attacksPerSecond: 0,
      drops: {},
      maxHealth: Infinity,
      maxLevel: 0,
      minLevel: 0,
      name: "Dummy",
      scale: 1,
      speed: 0,
      type: "dummy",
      weight: 0,
      xpAmount: 0,
    };
    const enemy = new Enemy(
      this,
      this.scale.width / 2 - 100,
      this.scale.height / 2,
      dummyDef,
    );
    this.enemies.add(enemy);
  }

  private barrage() {
    const isCritical = randomChance(this.hero.attributes.criticalChance);
    const numberOfArrows = 72;
    const distance = 1000;
    for (let i = 0; i < numberOfArrows; i++) {
      const angle = (360 / numberOfArrows) * i;
      const arrow = new DirectionalArrow(
        this,
        this.hero.x,
        this.hero.y,
        this.hero.attackDamage,
        isCritical,
        this.hero.attackable,
        500,
        10,
        angle,
        distance,
      );
      this.arrows.add(arrow);
    }
  }
}

export default PlaygroundScene;
