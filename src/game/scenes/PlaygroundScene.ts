import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";
import { EnemyDef } from "../game-objects/enemies.ts";

class PlaygroundScene extends AbstractGameplayScene {
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    super.create();
    this.createDummyEnemy();
  }

  protected registerEventListeners() {
    super.registerEventListeners();
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["1", "2"].includes(event.key)) {
        const skillsMap = {
          "1": "freeze",
          "2": "barrage",
        };
        console.log(skillsMap[event.key as "1" | "2"]);
      }
    });
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
      type: "imp",
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
}

export default PlaygroundScene;
