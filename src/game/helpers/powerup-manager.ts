export enum MultipliableStat {
  damage = "damage",
  attackSpeed = "attackSpeed",
  walkSpeed = "walkSpeed",
}

export enum BooleanStats {
  invulnerability = "invulnerability",
}

export default class PowerupManager {
  private multiplierStats: { [key: string]: number } = {};
  private booleanStats: { [key: string]: boolean } = {};

  setMultiplierStat(name: MultipliableStat, value: number) {
    this.multiplierStats[name] = value;
  }

  getMultiplierStat(name: MultipliableStat) {
    return this.multiplierStats[name] ?? 1;
  }

  setBooleanStat(name: BooleanStats, value: boolean) {
    this.booleanStats[name] = value;
  }

  getBooleanStat(name: BooleanStats) {
    return this.booleanStats[name] ?? false;
  }
}
