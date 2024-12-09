export default class ExtraEffectsManager {
  private _damageMultiplier: number = 1;
  private _speedMultiplier: number = 1;

  multiplyDamage(value: number) {
    this._damageMultiplier *= value;
  }

  get damageMultiplier() {
    return this._damageMultiplier;
  }

  multiplySpeed(value: number) {
    this._speedMultiplier *= value;
  }

  get speedMultiplier() {
    return this._speedMultiplier;
  }
}
