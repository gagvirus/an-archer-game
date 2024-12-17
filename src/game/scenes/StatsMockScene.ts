import Phaser from 'phaser';

export default class StatsMockScene extends Phaser.Scene {
  constructor() {
    super({key: 'StatsScene'});
  }

  preload() {
    // Preload any assets if necessary (fonts, etc.)
  }

  create() {
    const screenPadding = 20;
    const panelSpacing = 10;

    // Calculate screen dimensions
    const screenWidth = this.scale.width - screenPadding * 2;
    const screenHeight = this.scale.height - screenPadding * 2;

    // Panel dimensions
    const panelWidth = (screenWidth - panelSpacing * 2) / 3;
    const panelHeight = screenHeight;

    // Create panels using RexUI
    const panels = ['Text1', 'Text2', 'Text3'].map((text) => {
      return this.createPanel(text, panelWidth, panelHeight);
    });

    // Create a horizontal box layout to arrange panels
    this.rexUI.add.sizer({
      x: screenPadding + panelWidth / 2,
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
    return this.rexUI.add.sizer({
      width,
      height,
      orientation: 'y', // Vertical layout
    })
      .addBackground(
        this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x333333)
          .setStrokeStyle(2, 0xffffff)
      )
      .add(
        this.add.text(0, 0, title, {
          fontSize: '20px',
          color: '#ffffff',
        }),
        0, // Fixed size
        'center', // Align center
        {top: 10}, // Padding at the top
        false
      )
      .layout();
  }
}
