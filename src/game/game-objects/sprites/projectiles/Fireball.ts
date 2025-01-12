import Sprite = Phaser.Physics.Arcade.Sprite;
import AbstractGameplayScene from "../../../scenes/AbstractGameplayScene.ts";

class Fireball extends Sprite {
  constructor(scene: AbstractGameplayScene, x: number, y: number) {
    super(scene, x, y, "effects_yellow");
    scene.add.existing(this);
    this.anims.play("fireball");
  }
}

export default Fireball;
