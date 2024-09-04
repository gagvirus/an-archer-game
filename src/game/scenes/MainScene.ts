import Pointer = Phaser.Input.Pointer;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import Enemy from "../logic/Enemy.ts";
import Arrow from "../logic/Arrow.ts";
import Skeleton from "../logic/Skeleton.ts";
import {getRandomPositionAwayFromPoint} from "../helpers/position-helper.ts";
import {createAnimatedText} from "../helpers/text-helpers.ts";

class MainScene extends Scene {
    level: number;
    enemies: Group;
    arrows: Group;
    hero: Hero;

    constructor() {
        // Call the Phaser.Scene constructor and pass the scene key
        super('MainScene');
        this.level = 1;  // Start at level 1
    }

    // Preload assets (if any)
    preload() {

    }

    // Create game objects
    create() {


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
        this.enemies = this.physics.add.group(); // Group to hold all enemies
        // Initialize arrow group
        this.arrows = this.physics.add.group(); // Group to hold all arrows

        // Initialize the hero in the center of the canvas
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.hero = new Hero(this, centerX, centerY);

        // Listener for keyboard inputs
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            console.log(`Key down: ${event.key}`);
            if (event.key === 'n') {
                this.nextLevel();  // Press 'n' to advance to the next level
            }
            if (event.key === 'Escape') {
                this.scene.pause();
                this.scene.launch('PauseMenu');
            }
        });

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.shootArrowAtNearestEnemy();
        });
        
        this.startLevel();
    }

    shootArrowAtNearestEnemy() {
        const nearestEnemy = this.getNearestEnemy();

        if (nearestEnemy) {
            this.arrows.add(this.hero.shootArrow(nearestEnemy));
        }
    }
    
    startLevel()
    {
        createAnimatedText(this, `Level ${this.level}`, 2000)
        this.spawnEnemies(); // Spawn more enemies for the new level
        console.log(`Level ${this.level} - ${this.enemies.countActive(true)} enemies spawned.`);
    }

    getNearestEnemy(): Enemy | null {
        let nearestEnemy: Enemy | null = null;
        let minDistance = Number.MAX_VALUE;

        this.enemies.getChildren().forEach((gameObject: GameObject) => {
            const enemy = gameObject as Enemy;
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                nearestEnemy = enemy as Enemy;
                minDistance = distance;
            }
        });

        return nearestEnemy;
    }

    // Update game state (called every frame)
    update() {
        // Make enemies move towards the hero and avoid collision with each other
        this.enemies.getChildren().forEach((gameObject: GameObject) => {
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

        this.arrows.getChildren().forEach((gameObject: GameObject) => {
            (gameObject as Arrow).update();
        });
    }

    spawnEnemies() {
        const numEnemies = this.level * 3; // Increase the number of enemies each level

        for (let i = 0; i < numEnemies; i++) {
            const {x, y} = getRandomPositionAwayFromPoint(this.scale.width - 50, this.scale.height - 50, this.hero, 200);
            const enemy = new Skeleton(this, x, y);
            this.enemies.add(enemy);
        }
    }

    nextLevel() {
        this.level += 1;   // Increase level
        this.enemies.clear(true, true); // Clear existing enemies
        this.startLevel();
    }

}

export default MainScene;