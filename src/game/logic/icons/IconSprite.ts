class IconSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, iconName: string) {
    // Pass the texture atlas and frame name to the Sprite constructor
    super(scene, x, y, "icons", iconName);

    // Add the sprite to the scene
    scene.add.existing(this);
  }
}

export default IconSprite;
