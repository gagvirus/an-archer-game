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

    constructor(finesse: number = 1, awareness: number = 1, resilience: number = 1, thoughtfulness: number = 1) {
        this.finesse = finesse;
        this.awareness = awareness;
        this.resilience = resilience;
        this.thoughtfulness = thoughtfulness;
    }

    get dexterity() {
        // affects Attack speed
        return this.finesse;
    }

    get agility() {
        // affects Evade chance
        return this.finesse;
    }

    get perception() {
        // affects Critical chance / Critical damage
        return this.awareness;
    }

    get strength() {
        // affects Attack damage
        return this.awareness;
    }

    get fortitude() {
        // affects armor rating
        return this.resilience;
    }

    get endurance() {
        // affects Max Health / Health Regen
        return this.resilience;
    }

    get intelligence() {
        // affects XP Gain
        return this.thoughtfulness;
    }

    get charisma() {
        // affects Bartering
        return this.thoughtfulness;
    }

    get luck() {
        // affects Coin Gain
        return this.thoughtfulness;
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
