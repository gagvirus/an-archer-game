import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import AbstractGameplayScene from "../scenes/AbstractGameplayScene.ts";
import { createText } from "../helpers/text-helpers.ts";
import Tooltip from "./tooltip.ts";

export default class UiIcon extends Container {
  constructor(
    scene: AbstractGameplayScene,
    position: Vector2Like,
    buttonSize: number,
    icon: string,
    activateKey?: string,
    tooltipText?: string,
    onClickCallback?: () => void,
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

    if (tooltipText) {
      const tooltip = new Tooltip(scene);
      iconSprite
        .setInteractive()
        .on("pointerdown", () => onClickCallback && onClickCallback())
        .on("pointerover", () => {
          tooltip.show(tooltipText);
        })
        .on("pointerout", () => {
          tooltip.hide();
        });
    }

    this.setSize(buttonSize, buttonSize);
  }
}
