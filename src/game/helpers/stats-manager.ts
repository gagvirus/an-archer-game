class StatsManager {
    strength: number;
    agility: number;
    endurance: number;

    constructor(strength: number = 1, agility: number = 1, endurance: number = 1) {
        this.strength = strength;
        this.agility = agility;
        this.endurance = endurance;
    }
}

export default StatsManager;
