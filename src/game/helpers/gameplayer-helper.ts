import HealthBar from "../logic/HealthBar.ts";

export const COOLDOWN_THRESHOLD = 10;

class Attackable {
    attackCooldown: number = 0;
    attacksPerSecond: number = 1;
    attackDamage: number = 1;
    health: number = 100;
    maxHealth: number = 100;
    healthBar: HealthBar;
    onDeath: () => void;
    onAttack: () => void;

    constructor(attacksPerSecond: number, attackDamage: number, maxHealth: number, healthBar: HealthBar, onDeath: () => void, onAttack: () => void) {
        this.attackCooldown = 0;
        this.attacksPerSecond = attacksPerSecond;
        this.attackDamage = attackDamage;
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.healthBar = healthBar;
        this.onDeath = onDeath;
        this.onAttack = onAttack;
    }

    attack() {
        if (this.attackCooldown < COOLDOWN_THRESHOLD) {
            this.attackCooldown = 1000 / this.attacksPerSecond;
            this.onAttack();
        }
    }
    
    update(delta: number)
    {
        this.attackCooldown -= delta;
        if (this.attackCooldown <= COOLDOWN_THRESHOLD)
        {
            this.attackCooldown = 0;
        }
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.onDeath();
        }
        console.log(`receive damage ${damage}`)
        console.log(`health is ${this.health}`);
        this.healthBar.updateHealth(this.health);
    }

    replenishHealth(amount: number) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
}

export {Attackable};