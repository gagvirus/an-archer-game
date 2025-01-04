import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";
import { EnemyDef } from "../game-objects/enemies.ts";
import { DirectionalArrow } from "../game-objects/DirectionalArrow.ts";
import { randomChance } from "../helpers/random-helper.ts";
import TargetedArrow from "../game-objects/TargetedArrow.ts";
import FreezeSpell from "../game-objects/FreezeSpell.ts";
import {
  ACTIVE_SKILLS_MAP,
  ActiveSkillCallbackMethods,
  ActiveSkillKey,
} from "../helpers/active-skills.ts";
import UiIcon from "../ui/icon.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import Group = Phaser.GameObjects.Group;
import GameObject = Phaser.GameObjects.GameObject;

class PlaygroundScene
  extends AbstractGameplayScene
  implements ActiveSkillCallbackMethods
{
  private arrows: Group;
  private freezeSpell?: FreezeSpell;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    super.create();
    this.createDummyEnemy();
    this.renderActiveSkillsPanel();
    this.arrows = this.add.group();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.arrows.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedArrow).update();
    });
    this.freezeSpell?.update();
  }

  freeze() {
    if (!this.freezeSpell) {
      this.freezeSpell = new FreezeSpell(
        this,
        this.hero.attackable,
        this.enemies,
      );
    } else {
      this.freezeSpell.destroy();
      this.freezeSpell = undefined;
    }
  }

  barrage() {
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
        this.enemies,
      );
      this.arrows.add(arrow);
    }
  }

  protected registerEventListeners() {
    super.registerEventListeners();
    const keys = Object.keys(ACTIVE_SKILLS_MAP);
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        const eventKey = event.key as ActiveSkillKey;
        const skill = ACTIVE_SKILLS_MAP[eventKey].callback;
        this[skill]();
      }
    });
  }

  private createDummyEnemy() {
    const dummyDef: EnemyDef = {
      attackDamage: 0,
      attackRange: 10,
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

  private renderActiveSkillsPanel() {
    const buttonSize = 64; // Set button size
    const padding = 10;
    const totalWidth =
      Object.keys(ACTIVE_SKILLS_MAP).length * (buttonSize + padding) - padding;

    const skillsBar = this.rexUI.add.sizer({
      x: this.cameras.main.width / 2 - totalWidth / 2,
      y: this.cameras.main.height - buttonSize,
      width: totalWidth,
      height: buttonSize,
      orientation: "horizontal",
      space: { item: padding },
    });

    Object.values(ACTIVE_SKILLS_MAP).forEach((skill) => {
      const button = new UiIcon(
        this,
        VectorZeroes(),
        buttonSize,
        skill.icon,
        skill.key,
        skill.description,
      )
        .setInteractive()
        .on("pointerdown", () => {
          this[skill.callback]();
        });
      skillsBar.add(button, { proportion: 0, expand: false });
    });

    skillsBar.layout();
  }
}

export default PlaygroundScene;
