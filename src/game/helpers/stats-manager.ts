import { isEasyMode, isRapidLevelUp } from "./registry-helper.ts";
import { Scene } from "phaser";
import Hero from "../logic/Hero.ts";
import { BooleanStats } from "./powerup-manager.ts";
import coreStats, {
  Attribute,
  ChildStat,
  CoreStat,
  StatType,
} from "./stats.ts";

export interface IStat {
  label: string;
  prop: string;
  description?: string;
}

export interface IChildStat extends IStat {
  prop: ChildStat;
  icon?: string;
  description?: string;
  attributes: IAttribute[];
}

export interface IAttribute extends IStat {
  prop: Attribute;
  type: StatType;
  icon?: string;
}

export interface ICoreStat extends IStat {
  prop: CoreStat;
  stats: IChildStat[];
  hotkey: string;
  icon: string;
  colors: [number, number, number];
}

class StatsManager {
  private scene: Scene;
  private owner: Hero;
  private _finesse: number;
  private _awareness: number;
  private _resilience: number;
  private _thoughtfulness: number;
  public unallocatedStats: number;

  constructor(
    scene: Scene,
    owner: Hero,
    finesse: number = 1,
    awareness: number = 1,
    resilience: number = 1,
    thoughtfulness: number = 1,
    unallocatedStats: number = 0,
  ) {
    this.scene = scene;
    this.owner = owner;
    this._finesse = finesse;
    this._awareness = awareness;
    this._resilience = resilience;
    this._thoughtfulness = thoughtfulness;
    this.unallocatedStats = unallocatedStats;
  }

  public getCoreStat(name: CoreStat) {
    return this[name];
  }

  public getChildStat(name: ChildStat) {
    return this[name];
  }

  public getAttribute(name: Attribute) {
    return this[name];
  }

  public addStat(name: CoreStat, amount: number) {
    this[name] += amount;
  }

  public get easyModeModifier(): number {
    if (isEasyMode(this.scene.game)) {
      return 10;
    }
    return 1;
  }

  public set finesse(value: number) {
    this._finesse = value;
  }

  public set awareness(value: number) {
    this._awareness = value;
  }

  public set resilience(value: number) {
    this._resilience = value;
  }

  public set thoughtfulness(value: number) {
    this._thoughtfulness = value;
  }

  public get finesse(): number {
    return this._finesse;
  }

  public get awareness(): number {
    return this._awareness;
  }

  public get resilience(): number {
    return this._resilience;
  }

  public get thoughtfulness(): number {
    return this._thoughtfulness;
  }

  protected get dexterity() {
    // affects Attack speed
    return this.finesse * this.easyModeModifier;
  }

  protected get agility() {
    // affects Evade chance
    return this.finesse * this.easyModeModifier;
  }

  protected get perception() {
    // affects Critical chance / Critical damage
    return this.awareness * this.easyModeModifier;
  }

  protected get strength() {
    // affects Attack damage
    return this.awareness * this.easyModeModifier;
  }

  protected get fortitude() {
    // affects armor rating
    return this.resilience * this.easyModeModifier;
  }

  protected get endurance() {
    // affects Max Health / Health Regen
    return this.resilience * this.easyModeModifier;
  }

  protected get intelligence() {
    // affects XP Gain
    return this.thoughtfulness * this.easyModeModifier;
  }

  protected get charisma() {
    // affects Bartering
    return this.thoughtfulness * this.easyModeModifier;
  }

  protected get luck() {
    // affects Coin Gain
    return this.thoughtfulness * this.easyModeModifier;
  }

  get baseAttackTime() {
    // when heroes are implemented, this value may be different per hero
    // the higher the number, the slower the attack speed will end up
    return 1.5;
  }

  get damageMultiplier() {
    // each strength point adds +5% to the level-adjusted damage
    return 1 + (this.strength - 1) * 0.05;
  }

  get attackSpeedBonus() {
    // each agility point adds +5 to attack speed rate
    return this.agility * 5;
  }

  get evadeChancePercent() {
    // each dexterity attribute adds +0.6667% to evade chance (not more than +60%)
    const chance = ((this.dexterity - 1) * 2) / 3;
    return chance > 60 ? 60 : chance;
  }

  get maxHealthMultiplier() {
    // each endurance point adds +10% to the level-adjusted max health
    return 1 + (this.endurance - 1) * 0.1;
  }

  get xpGainMultiplier() {
    return (
      1 +
      ((isRapidLevelUp(this.scene.game) ? 100 : 1) *
        (this.intelligence - 1) *
        1.1) /
        100
    );
  }

  get dropChanceModifier() {
    return Phaser.Math.Clamp(1 + (this.luck * 2) / 100, 1, 4);
  }

  get dropAmountModifier() {
    return Phaser.Math.Clamp(1 + (this.luck * 1.1) / 100, 1, 7);
  }

  get healthRegenPerInterval() {
    // each endurance point adds +((1.2^level) - 1) health regenerated per second
    return Math.pow(1.2, this.endurance - 1);
  }

  get healthRegenerationInterval() {
    // regenerated every 5 seconds
    // maybe to be modified later
    // todo: if this is changed, make sure to update registerHealthRegenerationIfNecessary function also
    return 2000;
  }

  get criticalChancePercent() {
    // each perception attribute adds +0.6667% to critical chance (not more than +60%)
    const chance = ((this.perception - 1) * 2) / 3;
    return chance > 60 ? 60 : chance;
  }

  get criticalExtraDamageMultiplier() {
    // each perception attribute adds +5% extra damage (on top of base +50% bonus damage) on critical hit
    return 1 + (50 + (this.perception - 1) * 5) / 100;
  }

  get armorRatingBonus() {
    // each fortitude attribute adds +5 to armor rating
    return this.fortitude * 4;
  }

  get armorRating() {
    const BASE_ARMOR_RATING = 1;
    const levelModifier = this.owner._level * 2;
    return BASE_ARMOR_RATING + levelModifier + this.armorRatingBonus;
  }

  get flatDamageReduction() {
    return this.armorRating / 10;
  }

  get percentReduction(): number {
    if (this.owner.extra.getBooleanStat(BooleanStats.invulnerability)) {
      return 1;
    }
    const maxReduction = 0.9; // Maximum 90% reduction
    const scalingFactor = 800; // Higher value makes percentage scale slower
    const reduction = 1 - scalingFactor / (scalingFactor + this.armorRating);
    return Math.min(reduction, maxReduction);
  }

  getFinalDamageReduction(damageReceived: number): number {
    const flatReduction = Phaser.Math.Clamp(
      this.flatDamageReduction,
      0,
      damageReceived - 1,
    );
    const percentReduction = this.percentReduction;
    const afterFlatReduction = damageReceived - flatReduction;
    return flatReduction + afterFlatReduction * percentReduction;
  }

  get attackRate() {
    const BASE_ATTACK_RATE = 100;
    const levelModifier = this.owner._level * 2;
    return BASE_ATTACK_RATE + levelModifier + this.attackSpeedBonus;
  }

  get attacksPerSecond() {
    const attackRate = Phaser.Math.Clamp(this.attackRate, 120, 800);
    return attackRate / 100 / this.baseAttackTime;
  }

  get extraDamageFromOverflowAttackSpeed() {
    const clampedAttackSpeed = this.attacksPerSecond;
    const unclampedAttackSpeed = this.attackRate / 100 / this.baseAttackTime;
    if (unclampedAttackSpeed > clampedAttackSpeed) {
      return unclampedAttackSpeed / clampedAttackSpeed;
    }
    return 1;
  }

  static listAttributes(): IAttribute[] {
    const allAttributes: IAttribute[] = [];
    StatsManager.listCoreStats().forEach((coreStat) => {
      coreStat.stats.forEach((stat) => {
        stat.attributes.forEach((attribute) => {
          allAttributes.push(attribute);
        });
      });
    });
    return allAttributes;
  }

  static listCoreStats(): ICoreStat[] {
    return coreStats;
  }
}

export default StatsManager;
