class StatsManager {
    strength: number;
    agility: number;
    endurance: number;

    constructor(strength: number = 1, agility: number = 1, endurance: number = 1) {
        this.strength = strength;
        this.agility = agility;
        this.endurance = endurance;
    }

    listStats() {
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
        return ['Finesse', 'Awareness', 'Resilience', 'Thoughtfulness'];
    }
}

export default StatsManager;
