export interface Stat {
    label: string;
    prop: string;
}

export interface StatGroup {
    label: string;
    prop: string;
    description: string;
    stats: Stat[];
}

class StatsManager {
    finesse: number;
    awareness: number;
    resilience: number;
    thoughtfulness: number;
    unallocatedStats: number;

    constructor(finesse: number = 1, awareness: number = 1, resilience: number = 1, thoughtfulness: number = 1, unallocatedStats: number = 0) {
        this.finesse = finesse;
        this.awareness = awareness;
        this.resilience = resilience;
        this.thoughtfulness = thoughtfulness;
        this.unallocatedStats = unallocatedStats;
    }

    protected get dexterity() {
        // affects Attack speed
        return this.finesse;
    }

    protected get agility() {
        // affects Evade chance
        return this.finesse;
    }

    protected get perception() {
        // affects Critical chance / Critical damage
        return this.awareness;
    }

    protected get strength() {
        // affects Attack damage
        return this.awareness;
    }

    protected get fortitude() {
        // affects armor rating
        return this.resilience;
    }

    protected get endurance() {
        // affects Max Health / Health Regen
        return this.resilience;
    }

    protected get intelligence() {
        // affects XP Gain
        return this.thoughtfulness;
    }

    protected get charisma() {
        // affects Bartering
        return this.thoughtfulness;
    }

    protected get luck() {
        // affects Coin Gain
        return this.thoughtfulness;
    }

    get damageMultiplier()
    {
        // each strength point adds +5% to the level-adjusted damage
        return 1 + (this.strength - 1) * 0.05;
    }

    get attackSpeedMultiplier()
    {
        // each agility point adds +5% to the level-adjusted attack speed
        return 1 + (this.agility - 1) * 0.05;
    }

    get maxHealthMultiplier()
    {
        // each endurance point adds +10% to the level-adjusted max health
        return 1 + (this.endurance - 1) * 0.1
    }

    get xpGainMultiplier()
    {
        return Math.pow(1.05, this.intelligence - 1);
    }

    static listStatsGroups(): StatGroup[] {
        return [
            {
                label: 'Finesse',
                prop: 'finesse',
                description: '(OFF/DEF) affects Attack speed & Evade chance',
                stats: [
                    {label: 'Dexterity', prop: 'dexterity'},
                    {label: 'Agility', prop: 'agility'}
                ],
            },
            {
                label: 'Awareness',
                prop: 'awareness',
                description: '(OFF/OFF) affects Critical chance / Critical damage & Attack damage',
                stats: [
                    {label: 'Perception', prop: 'perception'},
                    {label: 'Strength', prop: 'strength'}
                ],
            },
            {
                label: 'Resilience',
                prop: 'resilience',
                description: '(DEF/DEF) affects armor rating & Max Health / Health Regen',
                stats: [
                    {label: 'Fortitude', prop: 'fortitude'},
                    {label: 'Endurance', prop: 'endurance'}
                ],
            },
            {
                label: 'Thoughtfulness',
                prop: 'thoughtfulness',
                description: '(MISC) affects XP Gain & Bartering & Coin Gain',
                stats: [
                    {label: 'Intelligence', prop: 'intelligence'},
                    {label: 'Charisma', prop: 'charisma'},
                    {label: 'Luck', prop: 'luck'}
                ],
            },
        ];
    }
}

export default StatsManager;
