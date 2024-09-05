export interface EnemyDef {
    maxHealth: number;
    speed: number;
    attackRange: number;
    attackDamage: number;
    attacksPerSecond: number;
    type: string;
    weight: number;
    scale: number;
}


export const enemies: EnemyDef[] = [
    {
        maxHealth: 50,
        speed: 75,
        attackRange: 100,
        attackDamage: 10,
        attacksPerSecond: 1,
        type: "skeleton",
        scale: 1.2,
        weight: 3,
    },
    {
        maxHealth: 20,
        speed: 125,
        attackRange: 20,
        attackDamage: 3,
        attacksPerSecond: 3,
        type: "imp",
        scale: 1,
        weight: 10,
    },
    {
        maxHealth: 200,
        speed: 25,
        attackRange: 50,
        attackDamage: 30,
        attacksPerSecond: 0.5,
        type: "demon",
        scale: 1.8,
        weight: 1,
    }
]