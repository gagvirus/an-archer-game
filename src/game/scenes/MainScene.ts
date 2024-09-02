import Pointer = Phaser.Input.Pointer;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import Enemy from "../logic/Enemy.ts";

class MainScene extends Scene {
    level: number;
    enemies: Group;
    hero: Hero;

    constructor() {
        // Call the Phaser.Scene constructor and pass the scene key
        super({key: 'MainScene'});
        this.level = 1;  // Start at level 1
        this.enemies = this.physics.add.group(); // Group to hold all enemies


        // Initialize the hero in the center of the canvas
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.hero = new Hero(this, centerX, centerY);
        this.hero.anims.play('idle');
    }

    // Preload assets (if any)
    preload() {
        this.load.spritesheet('hero', 'hero/running.png', {
            frameWidth: 64,  // Width of each frame in the spritesheet
            frameHeight: 64  // Height of each frame in the spritesheet
        });

        this.load.image('enemy', 'enemy.png');

        for (let i = 1; i <= 6; i++) {
            this.load.image(`enemy_walk_${i}`, `enemy/walk_${i}.png`);
            this.load.image(`enemy_attack_${i}`, `enemy/attack1_${i}.png`);
        }
    }

    // Create game objects
    create() {
        // Define the idle animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('hero', {start: 0, end: 1}), // Adjust start and end based on your spritesheet
            frameRate: 5,  // Animation speed
            repeat: -1      // Repeat indefinitely
        });

        // Define the running animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('hero', {start: 8, end: 15}), // Adjust start and end based on your spritesheet
            frameRate: 5,  // Animation speed
            repeat: -1      // Repeat indefinitely
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'walk',
            frames: Array.from({length: 6}, (_, i) => ({key: `enemy_walk_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation using the custom texture
        this.anims.create({
            key: 'attack',
            frames: Array.from({length: 6}, (_, i) => ({key: `enemy_attack_${i + 1}`, frame: 0})),
            frameRate: 10,
            repeat: -1
        });

        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            console.log(`Pointer down at x: ${pointer.x}, y: ${pointer.y}`);
        });

        // Listener for keyboard inputs
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            console.log(`Key down: ${event.key}`);
        });

        // Listener for pointer movement
        this.input.on('pointermove', () => {
            // console.log(`Pointer moved to x: ${pointer.x}, y: ${pointer.y}`);
        });

        // Initialize enemy group
        this.enemies = this.physics.add.group();

        // Spawn enemies for the initial level
        this.spawnEnemies();

        // Listener for keyboard inputs
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            console.log(`Key down: ${event.key}`);
            if (event.key === 'n') {
                this.nextLevel();  // Press 'n' to advance to the next level
            }
        });
    }

// Update game state (called every frame)
    update() {
        // Make enemies move towards the hero and avoid collision with each other
        (this.enemies as Group).getChildren().forEach((gameObject: GameObject) => {
            const enemy = gameObject as Enemy;
            enemy.move();
            enemy.avoidCollision(this.enemies, 50);
        });

        const cursors = (this.input.keyboard as KeyboardPlugin).createCursorKeys();

        // Update hero based on input
        this.hero.update(cursors);

        // Handle hero movement
        if (cursors.left.isDown) {
            this.hero.setFlipX(true);  // Flip the sprite to face left
            this.hero.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            this.hero.setFlipX(false);  // Flip the sprite to face left
            this.hero.setVelocityX(160);
        } else {
            this.hero.setVelocityX(0);
        }

        if (cursors.up.isDown) {
            this.hero.setVelocityY(-160);
        } else if (cursors.down.isDown) {
            this.hero.setVelocityY(160);
        } else {
            this.hero.setVelocityY(0);
        }
    }

    spawnEnemies() {
        const numEnemies = this.level * 3; // Increase the number of enemies each level

        for (let i = 0; i < numEnemies; i++) {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = Phaser.Math.Between(50, this.scale.height - 50);
            const enemy = new Enemy(this, x, y);
            this.enemies.add(enemy);
        }
    }

    nextLevel() {
        this.level += 1;   // Increase level
        this.enemies.clear(true, true); // Clear existing enemies
        this.spawnEnemies(); // Spawn more enemies for the new level
        console.log(`Level ${this.level} - ${this.enemies.countActive(true)} enemies spawned.`);
    }

}

export default MainScene;