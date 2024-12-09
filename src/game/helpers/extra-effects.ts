export default class ExtraEffectsManager {
  private _damageMultiplier: number = 1;
  private _attackSpeedMultiplier: number = 1;
  private _walkSpeedMultiplier: number = 1;

  multiplyDamage(value: number) {
    this._damageMultiplier *= value;
  }

  get damageMultiplier() {
    return this._damageMultiplier;
  }

  multiplyAttackSpeed(value: number) {
    this._attackSpeedMultiplier *= value;
  }

  get attackSpeedMultiplier() {
    return this._attackSpeedMultiplier;
  }

  multiplyWalkSpeed(value: number) {
    this._walkSpeedMultiplier *= value;
  }

  get walkSpeedMultiplier() {
    return this._walkSpeedMultiplier;
  }
}
