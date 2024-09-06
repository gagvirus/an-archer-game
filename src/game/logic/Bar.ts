import Vector2Like = Phaser.Types.Math.Vector2Like;

abstract class Bar {
    scene: Phaser.Scene;
    position: Vector2Like;
    positionOffset: Vector2Like;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    maxValue: number;
    currentValue: number;
    filledColor: number;
    emptyColor: number;

    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, maxValue: number, currentValue: number, positionOffset?: Vector2Like, filledColor?: number, emptyColor?: number) {
        this.scene = scene;
        this.position = position
        this.width = width;
        this.height = height;
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.positionOffset = positionOffset ?? {x: 0, y: 0};
        this.filledColor = filledColor ?? 0x00ff00;
        this.emptyColor = emptyColor ?? 0xff0000;
        this.bar = this.scene.add.graphics();
        this.draw();
    }

    // Draw the bar
    draw() {
        this.bar.clear();

        // Draw background (red bar)
        this.bar.fillStyle(this.emptyColor);
        this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, this.width, this.height);

        // Calculate the percentage
        const currentValueWidth = (this.currentValue / this.maxValue) * this.width;

        // Draw filled (green bar)
        if (currentValueWidth > 0) {
            this.bar.fillStyle(this.filledColor);
            this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, currentValueWidth, this.height);
        }
    }

    // Update the bar with the new current value
    updateBar(newValue: number, maxValue?: number) {
        this.currentValue = newValue;
        if (maxValue)
        {
            this.maxValue = maxValue;
        }
        this.draw();
    }

    destroy() {
        this.bar.destroy();
    }
}

export default Bar;