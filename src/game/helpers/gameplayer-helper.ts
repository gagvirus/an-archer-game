import HealthBar from '../logic/HealthBar.ts';
import XpBar from '../logic/XpBar.ts';
import StatsManager from './stats-manager.ts';
import Sprite = Phaser.GameObjects.Sprite;
import {Scene} from 'phaser';
import {showReplenishedHealth} from './text-helpers.ts';
import Vector2Like = Phaser.Types.Math.Vector2Like;

export const COOLDOWN_THRESHOLD = 10;

class XpManager {
    level: number;
    xp: number;
    xpBar: XpBar;
    onLevelUp: (newLevel: number) => void;

    constructor(initXpBar: (level: number, currentXp: number, xpToNextLevel: number) => XpBar, onLevelUp: (newLevel: number) => void) {
        this.level = 1;
        this.xp = 0;
        this.xpBar = initXpBar(this.level, this.xp, this.xpToNextLevel);
        this.xpBar.draw();
        this.onLevelUp = onLevelUp;
    }

    get xpToNextLevel() {
        return Math.pow(1.2, this.level - 1) * 100;
    }

    gainXp(amount: number) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            const xpOverflow = this.xp - this.xpToNextLevel;
            this.xp = 0;
            this.level += 1;
            this.onLevelUp(this.level);
            this.gainXp(xpOverflow);
            this.xpBar.level = this.level;
        }
        this.xpBar.updateBar(this.xp, this.xpToNextLevel);
    }
}

class Attackable {
    scene: Scene;
    attackCooldown: number = 0;
    attacksPerSecond: number = 1;
    attackDamage: number = 1;
    health: number = 100;
    maxHealth: number = 100;
    healthBar: HealthBar;
    owner: Sprite;
    onDeath: () => void;
    onAttack: () => void;
    regenerationInterval: number;

    constructor(scene: Scene, attacksPerSecond: number, attackDamage: number, maxHealth: number, initHealthBar: ((initialHealth: number) => HealthBar), onDeath: () => void, onAttack: () => void, owner: Sprite) {
        this.scene = scene;
        this.attackCooldown = 0;
        this.attacksPerSecond = attacksPerSecond;
        this.attackDamage = attackDamage;
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.healthBar = initHealthBar(maxHealth);
        this.onDeath = onDeath;
        this.onAttack = onAttack;
        this.owner = owner;

        this.registerHealthRegenerationIfNecessary();
    }

    attack() {
        if (this.attackCooldown < COOLDOWN_THRESHOLD) {
            this.attackCooldown = 1000 / this.attacksPerSecond;
            this.onAttack();
        }
    }

    update(delta: number) {
        this.attackCooldown -= delta;
        if (this.attackCooldown <= COOLDOWN_THRESHOLD) {
            this.attackCooldown = 0;
        }
    }

    takeDamage(damage: number, onDeath?: (attackable: Attackable) => void) {
        this.health -= damage;
        if (this.health <= 0) {
            this.onDeath();
            onDeath && onDeath(this);
        }
        this.healthBar.updateBar(this.health);
    }

    replenishHealth(amount: number) {
        if (amount > 1) {
            if (this.scene) {
                if (this.health < this.maxHealth) {
                    showReplenishedHealth(this.scene, this.owner as Vector2Like, amount)
                }
            }
            this.health += amount;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
            this.healthBar.updateBar(this.health, this.maxHealth);
        }
    }

    setMaxHealth(maxHealth: number, replenishToMaxHealth: boolean = false) {
        const healthDiff = maxHealth - this.maxHealth;
        this.maxHealth = maxHealth;
        if (replenishToMaxHealth) {
            // setting current health to max
            this.health = maxHealth;
        } else {
            this.health += healthDiff;
        }
        // updating the health bar UI
        this.healthBar.updateBar(this.health, this.maxHealth);
    }

    onKilledTarget(target: Attackable) {
        if ('xpManager' in this.owner) {
            if ('xpAmount' in target.owner) {
                const xpAmount: number = target.owner.xpAmount as number;
                let xpGainMultiplier = 1;
                if ('stats' in this.owner) {
                    xpGainMultiplier = (this.owner.stats as StatsManager).xpGainMultiplier;
                }

                (this.owner.xpManager as XpManager).gainXp(xpAmount * xpGainMultiplier);
            }
        }
    }

    registerHealthRegenerationIfNecessary() {
        if ('stats' in this.owner) {
            if (this.regenerationInterval) {
                clearInterval(this.regenerationInterval);
            }
            const statsManager = this.owner.stats as StatsManager;
            if (statsManager.healthRegenerationInterval > 0) {
                this.regenerationInterval = setInterval(() => {
                    this.replenishHealth(statsManager.healthRegenPerInterval)
                }, statsManager.healthRegenerationInterval);
            }
        }
    }
}

export {Attackable, XpManager};
