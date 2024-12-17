import {
  COLOR_WHITE,
  HEX_COLOR_GREY,
  HEX_COLOR_LIGHT_GREY,
} from "../helpers/colors.ts";
import { createText } from "../helpers/text-helpers.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

class Tooltip extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private readonly padding = 10;

  constructor(scene: Phaser.Scene, x: number, y: number, message: string) {
    super(scene, x, y);

    // Tooltip background
    this.background = scene.add
      .rectangle(0, 0, 0, 0, HEX_COLOR_LIGHT_GREY, 0.8)
      .setOrigin(0);

    // Tooltip text

    this.text = createText(
      this.scene,
      message,
      {
        x: 10,
        y: 10,
      },
      14,
      "left",
      false,
      COLOR_WHITE,
      { wordWrap: { width: 180 } },
    ).setOrigin(0, 0);

    // Add elements to container
    this.add([this.background, this.text]);

    // Initially hide the tooltip
    this.setVisible(false);

    // Add the tooltip container to the scene
    scene.add.existing(this);
  }

  // Show the tooltip
  show(position: Vector2Like, text?: string) {
    let { x, y } = position;
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    // Adjust position to stay on screen
    if (x + this.background.width + this.padding > screenWidth) {
      x = screenWidth - this.background.width - this.padding;
    }
    if (y + this.background.height + this.padding > screenHeight) {
      y = screenHeight - this.background.height - this.padding;
    }

    this.setPosition(x + 10, y + 10); // Offset to avoid covering the mouse
    this.setVisible(true);
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: "Power2",
    });
    this.scene.children.bringToTop(this);
    if (text) {
      this.setText(text);
    }
  }

  setText(text?: string) {
    this.text.setText(text ?? "");
    // Adjust background size to fit text
    this.background.setSize(
      this.text.width + this.padding * 2,
      this.text.height + this.padding * 2,
    );
    this.background.setStrokeStyle(2, HEX_COLOR_GREY);
  }

  // Hide the tooltip
  hide() {
    this.setVisible(false);
  }
}

export default Tooltip;
