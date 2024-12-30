import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";
import { HeroClass, heroClasses } from "../../helpers/hero-manager.ts";

export class HeroClassLayer implements AttributeLayer {
  private _heroClass: HeroClass;
  constructor(heroClass: HeroClass = HeroClass.default) {
    this._heroClass = heroClass;
  }

  get heroClass() {
    return this._heroClass;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.damage]: heroClasses[this.heroClass].damage,
      [Attribute.health]: heroClasses[this.heroClass].health,
      [Attribute.attackRate]: heroClasses[this.heroClass].attackRate,
      [Attribute.baseAttackTime]: heroClasses[this.heroClass].baseAttackTime,
      [Attribute.healthRegenInterval]:
        heroClasses[this.heroClass].healthRegenInterval,
      [Attribute.movementSpeed]: heroClasses[this.heroClass].movementSpeed,
    };
  }
}
