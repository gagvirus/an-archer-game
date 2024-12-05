import Phaser from 'phaser';
import Enemy from './Enemy.ts';
import Arrow from './Arrow.ts';
import HealthBar from './HealthBar.ts';
import MainScene from '../scenes/MainScene.ts';
import {Attackable, XpManager} from '../helpers/gameplayer-helper.ts';
import XpBar from './XpBar.ts';
import {isAutoAttackEnabled} from '../helpers/registry-helper.ts';
import StatsManager from '../helpers/stats-manager.ts';
import {addLogEntry, LogEntryCategory} from '../helpers/log-utils.ts';
import {VectorZeroes} from '../helpers/position-helper.ts';
import {CustomCursorKeysDown} from '../helpers/keyboard-helper.ts';
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
        this.name = 'Hero';

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
            this.scene,
            this.attacksPerSecond, // attacks per second
            this.attackDamage, // attack damage
            this.maxHealth, // initial health
            (maxHealth: number) => new HealthBar(scene, {x: 20, y: 20}, 200, 20, maxHealth, VectorZeroes(), true),
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
        return (BASE_DAMAGE + levelModifier) * this.stats.damageMultiplier;
    }

    get attacksPerSecond() {
        const BASE_ATTACKS_PER_SECOND = 2;
        const levelModifier = (BASE_ATTACKS_PER_SECOND * this._level * 0.05);
        return (BASE_ATTACKS_PER_SECOND + levelModifier) * this.stats.attackSpeedMultiplier;
    }

    get maxHealth() {
        const BASE_MAX_HEALTH = 100;
        const levelModifier = Math.pow(1.1, this._level - 1) * 10 - 10;
        return (BASE_MAX_HEALTH + levelModifier) * this.stats.maxHealthMultiplier;
    }

    get damagePerSecond() {
        const critChance = this.stats.criticalChancePercent;
        const critDamageMultiplier = this.stats.criticalExtraDamageMultiplier;
        const pureDps = this.attacksPerSecond * this.attackDamage;
        const criticalAttacksNumber = this.attacksPerSecond * critChance / 100;
        const criticalExtraDamage = (criticalAttacksNumber * this.attackDamage) * (critDamageMultiplier - 1);
        return pureDps + criticalExtraDamage;
    }


    onLevelUp = (newLevel: number) => {
        addLogEntry(`${this.name} has become LVL ${newLevel} !`, LogEntryCategory.Loot);
        this._level = newLevel;
        this.attackable.setMaxHealth(this.maxHealth, false)
        this.attackable.attackDamage = this.attackDamage;
        this.attackable.attacksPerSecond = this.attacksPerSecond;
        const statPointsToGrant = this.statPointsToGrant;
        this.stats.unallocatedStats += statPointsToGrant;
        addLogEntry(`${this.name} has received ${statPointsToGrant} stat points.`, LogEntryCategory.Loot)
        this.xpManager.xpBar.setUnallocatedStats(this.stats.unallocatedStats);
        this.scene.events.emit('levelUp');
    }

    get statPointsToGrant() {
        if (this._level % 100 < 1) {
            // on level 100, 200... grant 50 points
            return 50;
        }
        if (this._level % 50 < 1) {
            // on level 50, 150... grant 20 points
            return 25;
        }
        if (this._level % 25 < 1) {
            // on level 25, 75, 125... grant 10 points
            return 10;
        }
        if (this._level % 10 < 1) {
            // on level 10, 20... grant 5 points
            return 5;
        }
        if (this._level % 5 < 1) {
            // on level 5, 15, 35... grant 3 points
            return 3;
        }
        return 1;
    }

    initXpBar = (level: number, currentXp: number, xpToNextLevel: number) => new XpBar(this.scene, {
        x: 20,
        y: 50
    }, 200, 20, level, currentXp, xpToNextLevel)

    // Method to update the hero's animation based on movement
    // @ts-expect-error we *must* receive time
    update(cursors: CustomCursorKeysDown, time: numer, delta: number) {
        if (cursors.left || cursors.right || cursors.up || cursors.down) {
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
