import Enemy from "./Enemy.ts";

class Skeleton extends Enemy {
    initStats(): void {
        this.maxHealth = 50;
        this.speed = 75;
        this.attackRange = 100;
        this.attackDamage = 10;
        this.type = 'skeleton';
    }
}

export default Skeleton;