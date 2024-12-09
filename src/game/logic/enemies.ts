import {HEX_COLOR_DANGER, HEX_COLOR_WARNING} from "../helpers/colors.ts";
import {ResourceType} from "./Resource.ts";

// min amount, max amount, chance
export type ResourceDropChance = [number, number, number];
export type EnemyDrops = Partial<{ [key in ResourceType]: ResourceDropChance }>;

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
    drops: EnemyDrops;
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
        drops: {
            [ResourceType.coin]: [3, 10, 25],
        },
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
        tint: HEX_COLOR_WARNING,
        drops: {
            [ResourceType.coin]: [10, 40, 35],
        },
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
        tint: HEX_COLOR_DANGER,
        drops: {
            [ResourceType.coin]: [50, 200, 45],
        },
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
        drops: {
            [ResourceType.coin]: [1, 2, 15],
            [ResourceType.soul]: [1, 1, 25],
        },
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
        tint: HEX_COLOR_WARNING,
        drops: {
            [ResourceType.coin]: [3, 10, 20],
            [ResourceType.soul]: [2, 3, 30],
        },
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
        tint: HEX_COLOR_DANGER,
        drops: {
            [ResourceType.coin]: [10, 25, 25],
            [ResourceType.soul]: [3, 5, 35],
        },
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
        drops: {
            [ResourceType.soul]: [10, 20, 100],
        },
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
        maxLevel: Infinity,
        scale: 2.5,
        weight: 0.2,
        tint: HEX_COLOR_DANGER,
        drops: {
            [ResourceType.coin]: [500, 1000, 100],
            [ResourceType.soul]: [100, 200, 100],
        },
    }
]
