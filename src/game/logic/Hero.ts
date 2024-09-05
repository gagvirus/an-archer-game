import Phaser from "phaser";
import Enemy from "./Enemy.ts";
import Arrow from "./Arrow.ts";
import HealthBar from "./HealthBar.ts";
import MainScene from "../scenes/MainScene.ts";
import {Attackable, XpManager} from "../helpers/gameplayer-helper.ts";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;
import XpBar from "./XpBar.ts";

class Hero extends Phaser.Physics.Arcade.Sprite {
    arrows: Group;
    attackable: Attackable;
    xpManager: XpManager;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'hero');  // 'hero' is the key for the hero sprite
        scene.add.existing(this);     // Add the hero to the scene
        scene.physics.add.existing(this); // Enable physics for the hero
        this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen

        // Initialize arrow group
        this.arrows = scene.add.group(); // Group to hold all arrows

        // initial state
        this.state = 'idle';
        this.anims.play('idle');

        scene.input.keyboard?.on('keydown-SPACE', () => {
            this.attackable.attack();
        });
        this.attackable = new Attackable(
            2, // attacks per second
            10, // attack damage
            100, // initial health
            (maxHealth: number) => new HealthBar(scene, {x: 20, y: 20}, 200, 20, maxHealth), 
            () => this.scene.scene.start('GameOver'),
            () => {
                const nearestEnemy = this.getNearestEnemy();
                if (nearestEnemy) {
                    this.arrows.add(this.shootArrow(nearestEnemy));
                }
            },
            this
        )
        
        this.xpManager = new XpManager((xpToNextLevel: number) => new XpBar(scene, {x: 20, y: 50}, 200, 20, xpToNextLevel));
    }

    // Method to update the hero's animation based on movement
    // @ts-expect-error we *must* receive time
    update(cursors: CursorKeys, time: numer, delta: number) {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
            if (this.state !== 'run') {
                this.state = 'run';
                this.anims.play('run', true);
            }
        } else {
            if (this.state !== 'idle') {
                this.state = 'idle';
                this.anims.play('idle', true);
            }
        }
        this.arrows.getChildren().forEach((gameObject: GameObject) => {
            (gameObject as Arrow).update();
        });
        this.attackable.update(delta);
    }

    shootArrow(target: Enemy) {
        const arrow = new Arrow(this.scene, this.x, this.y, target, target.attackable, 500, this.attackable);
        this.scene.add.existing(arrow);
        return arrow;
    }

    getNearestEnemy(): Enemy | null {
        let nearestEnemy: Enemy | null = null;
        let minDistance = Number.MAX_VALUE;

        (this.scene as MainScene).enemies.getChildren().forEach((gameObject: GameObject) => {
            const enemy = gameObject as Enemy;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                nearestEnemy = enemy as Enemy;
                minDistance = distance;
            }
        });

        return nearestEnemy;
    }
}

export default Hero;