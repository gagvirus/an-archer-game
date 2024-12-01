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
        // Finesse
        //  - Dexterity / Agility
        //  - affects Attack speed & Evade chance
        // Awareness
        //  - Perception & ???
        //  - affects Critical chance / Critical damage & armor rating
        // Resilience
        //  - Strength & Endurance
        //  - affects Attack damage & Max Health / Health Regen
        // Thoughtfulness
        //  - Intelligence / Charisma
        //  - affects XP Gain & Bartering
        return ['Finesse', 'Awareness', 'Resilience', 'Thoughtfulness'];
    }
}

export default StatsManager;
