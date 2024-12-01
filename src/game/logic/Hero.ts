import Phaser from 'phaser';
import Enemy from './Enemy.ts';
import Arrow from './Arrow.ts';
import HealthBar from './HealthBar.ts';
import MainScene from '../scenes/MainScene.ts';
import {Attackable, XpManager} from '../helpers/gameplayer-helper.ts';
import XpBar from './XpBar.ts';
import {isAutoAttackEnabled} from '../helpers/registry-helper.ts';
import StatsManager from '../helpers/stats-manager.ts';
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;

class Hero extends Phaser.Physics.Arcade.Sprite {
    arrows: Group;
    attackable: Attackable;
    xpManager: XpManager;
    stats: StatsManager;
    _level: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'hero');  // 'hero' is the key for the hero sprite
        scene.add.existing(this);     // Add the hero to the scene
        scene.physics.add.existing(this); // Enable physics for the hero
        this.setCollideWorldBounds(true); // Prevent the hero from moving offscreen
        this._level = 1;

        // Initialize arrow group
        this.arrows = scene.add.group(); // Group to hold all arrows

        // initial state
        this.state = 'idle';
        this.anims.play('idle');

        if (!isAutoAttackEnabled(scene.game)) {
            scene.input.keyboard?.on('keydown-SPACE', () => {
                this.attackable.attack();
            });
        }
        this.stats = new StatsManager(1, 1, 1, 1);
        this.attackable = new Attackable(
            this.attacksPerSecond, // attacks per second
            this.attackDamage, // attack damage
            this.maxHealth, // initial health
            (maxHealth: number) => new HealthBar(scene, {x: 20, y: 20}, 200, 20, maxHealth, {x: 0, y: 0}, true),
            () => this.scene.scene.start('GameOver'),
            () => {
                const nearestEnemy = this.getNearestEnemy();
                if (nearestEnemy) {
                    this.arrows.add(this.shootArrow(nearestEnemy));
                }
            },
            this
        )

        this.xpManager = new XpManager(this.initXpBar, this.onLevelUp);
    }

    get attackDamage() {
        const BASE_DAMAGE = 10;
        const levelModifier = BASE_DAMAGE * (this._level - 1) * 0.2;
        // each strength point adds +5% to the level-adjusted damage
        const strengthModifier = 1 + (this.stats.strength - 1) * 0.05;
        return (BASE_DAMAGE + levelModifier) * strengthModifier;
    }

    get attacksPerSecond() {
        const BASE_ATTACKS_PER_SECOND = 2;
        const levelModifier = (BASE_ATTACKS_PER_SECOND * this._level * 0.05);
        // each agility point adds +5% to the level-adjusted attack speed
        const agilityModifier = 1 + (this.stats.agility - 1) * 0.05;
        return (BASE_ATTACKS_PER_SECOND + levelModifier) * agilityModifier;
    }

    get maxHealth() {
        const BASE_MAX_HEALTH = 100;
        const levelModifier = Math.pow(1.1, this._level - 1) * 10 - 10;
        // each endurance point adds +10% to the level-adjusted max health
        const enduranceModifier = 1 + (this.stats.endurance - 1) * 0.1;
        return (BASE_MAX_HEALTH + levelModifier) * enduranceModifier;
    }


    onLevelUp = (newLevel: number) => {
        this._level = newLevel;
        this.attackable.setMaxHealth(this.maxHealth)
        this.attackable.attackDamage = this.attackDamage;
        this.attackable.attacksPerSecond = this.attacksPerSecond;
        this.stats.unallocatedStats += 1;
    }

    initXpBar = (level: number, currentXp: number, xpToNextLevel: number) => new XpBar(this.scene, {x: 20, y: 50}, 200, 20, level, currentXp, xpToNextLevel)

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
        isAutoAttackEnabled(this.scene.game) && this.attackable.attack();
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
