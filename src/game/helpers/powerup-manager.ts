import { PowerupType } from "../logic/drop/powerup/timed/powerupType.ts";

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

  isEnabled(name: PowerupType) {
    const stat = this.getStatForPowerup(name);
    if (stat in MultipliableStat) {
      return this.getMultiplierStat(stat as MultipliableStat) != 1;
    } else {
      return this.getBooleanStat(stat as BooleanStats);
    }
  }

  getStatForPowerup(name: PowerupType): BooleanStats | MultipliableStat {
    switch (name) {
      case PowerupType.DoubleSpeed:
        return MultipliableStat.attackSpeed;
      case PowerupType.Invulnerability:
        return BooleanStats.invulnerability;
      case PowerupType.DoubleDamage:
      default:
        return MultipliableStat.damage;
    }
  }

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
