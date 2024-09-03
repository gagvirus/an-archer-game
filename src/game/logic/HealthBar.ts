class HealthBar {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    maxHealth: number;
    health: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, maxHealth: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.bar = this.scene.add.graphics();
        this.draw();
    }

    // Draw the health bar
    draw() {
        this.bar.clear();

        // Draw background (red bar)
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // Calculate health percentage
        const healthWidth = (this.health / this.maxHealth) * this.width;

        // Draw health (green bar)
        if (healthWidth > 0) {
            this.bar.fillStyle(0x00ff00);
            this.bar.fillRect(this.x, this.y, healthWidth, this.height);
        }
    }

    // Update the health bar with the new health value
    updateHealth(newHealth: number) {
        this.health = newHealth;
        this.draw();
    }
}

export default HealthBar;