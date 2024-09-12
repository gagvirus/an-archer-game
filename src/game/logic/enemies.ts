import {COLOR_DANGER, COLOR_WARNING} from '../helpers/colors.ts';

export interface EnemyDef {
    name: string;
    maxHealth: number;
    speed: number;
    attackRange: number;
    attackDamage: number;
    attacksPerSecond: number;
    type: string;
    xpAmount: number;
    minLevel: number;
    maxLevel: number;
    weight: number;
    scale: number;
    tint?: number;
}


export const enemies: EnemyDef[] = [
    {
        maxHealth: 50,
        speed: 75,
        attackRange: 100,
        attackDamage: 10,
        attacksPerSecond: 1,
        type: "skeleton",
        name: "Skeleton",
        xpAmount: 25,
        minLevel: 3,
        maxLevel: 15,
        scale: 1.2,
        weight: 3,
    },
    {
        maxHealth: 100,
        speed: 100,
        attackRange: 125,
        attackDamage: 50,
        attacksPerSecond: 1.2,
        type: "skeleton",
        name: "Skeleton Warrior",
        xpAmount: 100,
        minLevel: 7,
        maxLevel: 50,
        scale: 1.3,
        weight: 3,
        tint: COLOR_WARNING,
    },
    {
        maxHealth: 100,
        speed: 100,
        attackRange: 125,
        attackDamage: 50,
        attacksPerSecond: 1.2,
        type: "skeleton",
        name: "Skeleton King",
        xpAmount: 500,
        minLevel: 15,
        maxLevel: 50,
        scale: 1.6,
        weight: 2,
        tint: COLOR_DANGER,
    },
    {
        maxHealth: 20,
        speed: 125,
        attackRange: 20,
        attackDamage: 3,
        attacksPerSecond: 3,
        type: "imp",
        name: "Implet",
        xpAmount: 10,
        minLevel: 1,
        maxLevel: 10,
        scale: 0.8,
        weight: 10,
    },
    {
        maxHealth: 100,
        speed: 150,
        attackRange: 35,
        attackDamage: 15,
        attacksPerSecond: 5,
        type: "imp",
        name: "Imp",
        xpAmount: 75,
        minLevel: 10,
        maxLevel: 50,
        scale: 1.1,
        weight: 10,
        tint: COLOR_WARNING,
    },
    {
        maxHealth: 250,
        speed: 125,
        attackRange: 75,
        attackDamage: 25,
        attacksPerSecond: 3,
        type: "imp",
        name: "Imp Overlord",
        xpAmount: 75,
        minLevel: 15,
        maxLevel: 50,
        scale: 1.1,
        weight: 10,
        tint: COLOR_DANGER,
    },
    {
        maxHealth: 200,
        speed: 25,
        attackRange: 50,
        attackDamage: 30,
        attacksPerSecond: 0.5,
        type: "demon",
        name: "Demon",
        xpAmount: 100,
        minLevel: 5,
        maxLevel: 50,
        scale: 1.8,
        weight: 1,
    },
    {
        maxHealth: 1500,
        speed: 20,
        attackRange: 100,
        attackDamage: 500,
        attacksPerSecond: 0.3,
        type: "demon",
        name: "Ultra Demon",
        xpAmount: 5000,
        minLevel: 25,
        maxLevel: 50,
        scale: 2.5,
        weight: 0.2,
        tint: COLOR_DANGER,
    }
]
