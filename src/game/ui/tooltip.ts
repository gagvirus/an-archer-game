import {COLOR_WHITE, HEX_COLOR_LIGHT_GREY} from "../helpers/colors.ts";
import {createText} from "../helpers/text-helpers.ts";

class Tooltip extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, message: string) {
    super(scene, x, y);

    // Tooltip background
    this.background = scene.add.rectangle(0, 0, 200, 50, HEX_COLOR_LIGHT_GREY, 0.8)
      .setOrigin(0)
      .setStrokeStyle(2, HEX_COLOR_LIGHT_GREY);

    // Tooltip text

    this.text = createText(this.scene, message, {x: 10, y: 10}, 14, 'left', false, COLOR_WHITE, {wordWrap: {width: 180}}).setOrigin(0, 0)

    // Add elements to container
    this.add([this.background, this.text]);

    // Initially hide the tooltip
    this.setVisible(false);

    // Add the tooltip container to the scene
    scene.add.existing(this);
  }

  // Show the tooltip
  show(x: number, y: number) {
    const padding = 10;
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    // Adjust position to stay on screen
    if (x + this.background.width + padding > screenWidth) {
      x = screenWidth - this.background.width - padding;
    }
    if (y + this.background.height + padding > screenHeight) {
      y = screenHeight - this.background.height - padding;
    }


    this.setPosition(x + 10, y + 10); // Offset to avoid covering the mouse
    this.setVisible(true);
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: 'Power2',
    });
    this.scene.children.bringToTop(this);
  }

  setText(text?: string) {
    this.text.setText(text ?? '');
    // Adjust background size to fit text
    const padding = 10;
    this.background.width = this.text.width + padding * 2;
    this.background.height = this.text.height + padding * 2;
  }

  // Hide the tooltip
  hide() {
    this.setVisible(false);
  }
}

export default Tooltip;
