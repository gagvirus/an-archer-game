import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";

export default class UiIcon extends Container {
  constructor(
    scene: AbstractGameplayScene,
    position: Vector2Like,
    buttonSize: number,
    icon: string,
  ) {
    const { x, y } = position;
    super(scene, x, y);
    scene.add.existing(this);

    const backgroundSprite = scene.add.sprite(0, 0, "ui", "sprite1");
    const iconSprite = scene.add.sprite(0, 0, "icons", icon);

    backgroundSprite.scale = 2;
    iconSprite.setOrigin(0.5);

    this.add(backgroundSprite);
    this.add(iconSprite);
    this.setSize(buttonSize, buttonSize);
  }
}
