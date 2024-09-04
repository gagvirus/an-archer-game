import Enemy from "./Enemy.ts";

class Imp extends Enemy {
    initStats(): void {
        this.maxHealth = 20;
        this.speed = 125;
        this.attackRange = 20;
        this.attackDamage = 3;
        this.attacksPerSecond = 3;
        this.type = 'imp';
    }
}

export default Imp;