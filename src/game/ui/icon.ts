import Sprite = Phaser.GameObjects.Sprite;
import MainScene from "../scenes/MainScene.ts";

export default class UiIcon extends Sprite {
  constructor(scene: MainScene, x: number, y: number, icon: string) {
    super(scene, x, y, "ui", "sprite1");
    scene.add.existing(this);
    this.scale = 2;
    scene.add.sprite(x, y, "icons", icon);
  }
}
