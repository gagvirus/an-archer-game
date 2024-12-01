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

    get dexterity()
    {
        return this.finesse;
    }
    get agility()
    {
        return this.finesse;
    }
    get perception()
    {
        return this.awareness;
    }
    get strength()
    {
        return this.awareness;
    }
    get fortitude()
    {
        return this.resilience;
    }
    get endurance()
    {
        return this.resilience;
    }
    get intelligence()
    {
        return this.thoughtfulness;
    }
    get charisma()
    {
        return this.thoughtfulness;
    }

    listStatsGroups() {
        // Finesse (OFF/DEF)
        //  - Dexterity & Agility
        //  - affects Attack speed & Evade chance
        // Awareness (OFF/OFF)
        //  - Perception & Strength
        //  - affects Critical chance / Critical damage & Attack damage
        // Resilience (DEF/DEF)
        //  - Fortitude & Endurance
        //  - affects armor rating & Max Health / Health Regen
        // Thoughtfulness (MISC)
        //  - Intelligence & Charisma
        //  - affects XP Gain & Bartering
        return [
            {
                label: 'Finesse',
                description: '(OFF/DEF) affects Attack speed & Evade chance',
                stats: [
                    {
                        label: 'Dexterity',
                        prop: 'dexterity',
                    },
                    {
                        label: 'Agility',
                        prop: 'agility',
                    }
                ],
            },
            {
                label: 'Awareness',
                description: '(OFF/OFF) affects Critical chance / Critical damage & Attack damage',
                stats: [
                    {
                        label: 'Perception',
                        prop: 'perception',
                    },
                    {
                        label: 'Strength',
                        prop: 'strength',
                    }
                ],
            },
            {
                label: 'Resilience',
                description: '(DEF/DEF) affects armor rating & Max Health / Health Regen',
                stats: [
                    {
                        label: 'Fortitude',
                        prop: 'fortitude',
                    },
                    {
                        label: 'Endurance',
                        prop: 'endurance',
                    }
                ],
            },
            {
                label: 'Thoughtfulness',
                description: '(MISC) affects XP Gain & Bartering',
                stats: [
                    {
                        label: 'Intelligence',
                        prop: 'intelligence',
                    },
                    {
                        label: 'Charisma',
                        prop: 'charisma',
                    }
                ],
            },
        ];
    }
}

export default StatsManager;
