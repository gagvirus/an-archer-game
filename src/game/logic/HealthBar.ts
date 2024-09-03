interface Position {
    x: number;
    y: number;
}

class HealthBar {
    scene: Phaser.Scene;
    position: Position;
    positionOffset: Position;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    maxHealth: number;
    health: number;

    constructor(scene: Phaser.Scene, position: Position, width: number, height: number, maxHealth: number, positionOffset?: Position) {
        this.scene = scene;
        this.position = position
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.positionOffset = positionOffset ?? {x: 0, y: 0};

        this.bar = this.scene.add.graphics();
        this.draw();
    }

    // Draw the health bar
    draw() {
        this.bar.clear();

        // Draw background (red bar)
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, this.width, this.height);

        // Calculate health percentage
        const healthWidth = (this.health / this.maxHealth) * this.width;

        // Draw health (green bar)
        if (healthWidth > 0) {
            this.bar.fillStyle(0x00ff00);
            this.bar.fillRect(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y, healthWidth, this.height);
        }
    }

    // Update the health bar with the new health value
    updateHealth(newHealth: number) {
        this.health = newHealth;
        this.draw();
    }

    destroy() {
        this.bar.destroy();
    }
}

export default HealthBar;