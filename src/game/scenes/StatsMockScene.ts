import {Scene} from 'phaser';
import {HEX_COLOR_DARK, HEX_COLOR_WHITE} from "../helpers/colors.ts";
import {ISceneLifecycle} from "../ISceneLifecycle.ts";

export default class StatsMockScene extends Scene implements ISceneLifecycle {
  constructor() {
    super({key: 'StatsScene'});
  }

  create() {
    const screenPaddingX = this.scale.width / 10; // 10% of the screen
    const screenPaddingY = 20;
    const panelSpacing = 20;

    // Calculate screen dimensions
    const screenWidth = this.scale.width - screenPaddingX * 2;
    const screenHeight = this.scale.height - screenPaddingY * 2;

    // Panel dimensions
    const panelHeight = screenHeight;
    const panelWidths = [screenWidth * 0.3, screenWidth * 0.4, screenWidth * 0.3];

    // Create panels using RexUI
    const panels = ['Text1', 'Text2', 'Text3'].map((text, i) => {
      const panelWidth = panelWidths[i];
      return this.createPanel(text, panelWidth, panelHeight);
    });

    // Create a horizontal box layout to arrange panels
    this.rexUI.add.sizer({
      x: this.scale.width / 2,
      y: this.scale.height / 2,
      orientation: 'x', // Horizontal layout
      space: {item: panelSpacing}, // Space between panels
    })
      .add(panels[0], 1, 'center', 0, true)
      .add(panels[1], 1, 'center', 0, true)
      .add(panels[2], 1, 'center', 0, true)
      .layout();

    // Debug: Add a back button
    this.add.text(
      this.scale.width - 20,
      this.scale.height - 20,
      'Back',
      {fontSize: '16px', color: '#ffffff'}
    )
      .setOrigin(1, 1)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MainMenu')); // Replace 'MainMenu' with your menu scene key
  }

  private createPanel(title: string, width: number, height: number) {
    // Create a panel container with background and title text
    const container = this.rexUI.add.sizer({width, height, orientation: 'y'});
    container.addBackground(this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, HEX_COLOR_DARK).setStrokeStyle(2, HEX_COLOR_WHITE));
    const titleText = this.add.text(0, 0, title, {
      fontSize: '20px',
      color: '#ffffff',
    });
    container.add(titleText, {
      padding: {
        top: 10,
      }
    });

    container
      .layout();

    return container;
  }
}
