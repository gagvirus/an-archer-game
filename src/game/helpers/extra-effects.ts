export default class ExtraEffectsManager {
  private _damageMultiplier: number = 1;

  multiplyDamage(value: number) {
    this._damageMultiplier *= value;
  }

  get damageMultiplier() {
    return this._damageMultiplier;
  }
}
