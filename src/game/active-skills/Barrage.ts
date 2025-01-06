import AbstractSkill from "./abstract-skill.ts";
import { randomChance } from "../helpers/random-helper.ts";
import { DirectionalArrow } from "../game-objects/DirectionalArrow.ts";
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import TargetedArrow from "../game-objects/TargetedArrow.ts";
import Group = Phaser.GameObjects.Group;
import ArcadeGroup = Phaser.Physics.Arcade.Group;
import GameObject = Phaser.GameObjects.GameObject;

class Barrage extends AbstractSkill {
  private arrows: Group;

  constructor(scene: AbstractGameplayScene, targets: ArcadeGroup) {
    super(scene, targets);
    this.arrows = scene.add.group();
  }

  activate() {
    const numberOfArrows = 72;
    const distance = 1000;
    for (let i = 0; i < numberOfArrows; i++) {
      const isCritical = randomChance(this.hero.attributes.criticalChance);
      const angle = (360 / numberOfArrows) * i;
      const arrow = new DirectionalArrow(
        this.scene,
        this.hero.x,
        this.hero.y,
        this.hero.attackDamage,
        isCritical,
        this.hero.attackable,
        500,
        10,
        angle,
        distance,
        this.targets,
      );
      this.arrows.add(arrow);
    }
  }

  update() {
    this.arrows.getChildren().forEach((gameObject: GameObject) => {
      (gameObject as TargetedArrow).update();
    });
  }
}
export default Barrage;
