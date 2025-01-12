import Sprite = Phaser.Physics.Arcade.Sprite;
import AbstractGameplayScene from "../../../scenes/AbstractGameplayScene.ts";

class Arrow extends Sprite {
  constructor(scene: AbstractGameplayScene, x: number, y: number) {
    super(scene, x, y, "arrow");
    scene.add.existing(this);
  }
}

export default Arrow;
