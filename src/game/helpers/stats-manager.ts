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

    get damageMultiplier() {
        // each strength point adds +5% to the level-adjusted damage
        return 1 + (this.strength - 1) * 0.05;
    }

    get attackSpeedMultiplier() {
        // each agility point adds +5% to the level-adjusted attack speed
        return 1 + (this.agility - 1) * 0.05;
    }

    get evadeChancePercent()
    {
        // each dexterity attribute adds +0.6667% to evade chance (not more than +60%)
        const chance = (this.dexterity - 1) * 2 / 3;
        return chance > 60 ? 60 : chance;
    }

    get maxHealthMultiplier() {
        // each endurance point adds +10% to the level-adjusted max health
        return 1 + (this.endurance - 1) * 0.1
    }

    get xpGainMultiplier() {
        return Math.pow(1.05, this.intelligence - 1);
    }

    get healthRegenPerInterval() {
        // each endurance point adds +((1.2^level) - 1) health regenerated per second
        return Math.pow(1.2, this.endurance) - 1
    }

    get healthRegenerationInterval() {
        // regenerated every 5 seconds
        // maybe to be modified later
        // todo: if this is changed, make sure to update registerHealthRegenerationIfNecessary function also
        return 2000;
    }

    get criticalChancePercent() {
        // each perception attribute adds +0.6667% to critical chance (not more than +60%)
        const chance = (this.perception - 1) * 2 / 3;
        return chance > 60 ? 60 : chance;
    }

    get criticalExtraDamageMultiplier() {
        // each perception attribute adds +5% extra damage (on top of base +50% bonus damage) on critical hit
        return 1 + (50 + (this.perception - 1) * 5) / 100
    }

    get armorRatingAttribute() {
        // each fortitude attribute adds +0.6667% to armor rating (not more than +60%)
        const rating = (this.fortitude - 1) * 2 / 3;
        return rating > 80 ? 80 : rating;
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
