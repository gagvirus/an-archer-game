import AbstractGameplayScene from "./AbstractGameplayScene.ts";
import Enemy from "../game-objects/Enemy.ts";
import { EnemyDef } from "../game-objects/enemies.ts";
import { ACTIVE_SKILLS_MAP, ActiveSkillKey } from "../active-skills/utils.ts";
import UiIcon from "../ui/icon.ts";
import { VectorZeroes } from "../helpers/position-helper.ts";
import SkillsManager from "../active-skills/skills-manager.ts";

class PlaygroundScene extends AbstractGameplayScene {
  private manager: SkillsManager;
  constructor() {
    super("PlaygroundScene");
  }

  create() {
    super.create();
    this.createDummyEnemy();
    this.renderActiveSkillsPanel();
    this.manager = new SkillsManager(this, this.enemies);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.manager.update();
  }
  protected registerEventListeners() {
    super.registerEventListeners();
    const keys = Object.keys(ACTIVE_SKILLS_MAP);
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        const eventKey = event.key as ActiveSkillKey;
        this.manager.activateSkill(ACTIVE_SKILLS_MAP[eventKey]);
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
          this.manager.activateSkill(skill);
        },
      )
        .setInteractive()
        .on("pointerdown", () => {
          this.manager.activateSkill(skill);
        });
      skillsBar.add(button, { proportion: 0, expand: false });
    });

    skillsBar.layout();
  }
}

export default PlaygroundScene;
