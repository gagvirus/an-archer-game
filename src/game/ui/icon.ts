import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { createText } from "../helpers/text-helpers.ts";

export default class UiIcon extends Container {
  constructor(
    scene: AbstractGameplayScene,
    position: Vector2Like,
    buttonSize: number,
    icon: string,
    activateKey?: string,
    tooltipText?: string,
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
    if (activateKey) {
      const text = createText(
        scene,
        activateKey,
        {
          x: buttonSize / 2 - 5,
          y: buttonSize / 2 - 5,
        },
        16,
      ).setOrigin(1);
      this.add(text);
    }
    this.setSize(buttonSize, buttonSize);
  }
}
