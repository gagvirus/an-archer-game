import Enemy from "./Enemy.ts";

class Demon extends Enemy {
    initStats(): void {
        this.maxHealth = 200;
        this.speed = 25;
        this.attackRange = 50;
        this.attackDamage = 30;
        this.type = 'demon';
    }
}

export default Demon;