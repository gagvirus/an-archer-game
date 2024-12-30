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
    const attributes = heroClasses[this.heroClass].attributes;
    return {
      ...baseAttributes,
      [Attribute.damage]: attributes.damage ?? baseAttributes.damage,
      [Attribute.health]: attributes.health ?? baseAttributes.health,
      [Attribute.attackRate]:
        attributes.attackRate ?? baseAttributes.attackRate,
      [Attribute.baseAttackTime]:
        attributes.baseAttackTime ?? baseAttributes.baseAttackTime,
      [Attribute.healthRegenInterval]:
        attributes.healthRegenInterval ?? baseAttributes.healthRegenInterval,
      [Attribute.movementSpeed]:
        attributes.movementSpeed ?? baseAttributes.movementSpeed,
    };
  }
}
