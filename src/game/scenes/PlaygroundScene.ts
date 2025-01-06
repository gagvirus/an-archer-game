import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";
import { EnemyDef } from "../game-objects/enemies.ts";
import {
  ACTIVE_SKILLS_MAP,
  ActiveSkillCallbackMethods,
  ActiveSkillKey,
} from "../active-skills/utils.ts";
import UiIcon from "../ui/icon.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import Barrage from "../active-skills/Barrage.ts";
import Freeze from "../active-skills/Freeze.ts";

class PlaygroundScene
  extends AbstractGameplayScene
  implements ActiveSkillCallbackMethods
{
  private barrageSkill: Barrage;
  private freezeSkill: Freeze;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    super.create();
    this.createDummyEnemy();
    this.renderActiveSkillsPanel();

    this.barrageSkill = new Barrage(this, this.enemies);
    this.freezeSkill = new Freeze(this, this.enemies);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.barrageSkill.update();
    this.freezeSkill.update();
  }

  freeze() {
    this.freezeSkill.activate();
  }

  barrage() {
    this.barrageSkill.activate();
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
        () => {
          this[skill.callback]();
        },
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
