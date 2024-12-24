import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";
import { isEasyMode, isRapidLevelUp } from "../../helpers/registry-helper.ts";
import { Scene } from "phaser";

export class DifficultyLayer implements AttributeLayer {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  modify(baseAttributes: Attributes): Attributes {
    const difficultyMultiplier = isEasyMode(this.scene.game) ? 10 : 1;
    return {
      ...baseAttributes,
      [Attribute.xpRate]:
        baseAttributes.xpRate * (isRapidLevelUp(this.scene.game) ? 100 : 1),
      [Attribute.dexterity]: baseAttributes.dexterity * difficultyMultiplier,
      [Attribute.agility]: baseAttributes.agility * difficultyMultiplier,
      [Attribute.perception]: baseAttributes.perception * difficultyMultiplier,
      [Attribute.strength]: baseAttributes.strength * difficultyMultiplier,
      [Attribute.fortitude]: baseAttributes.fortitude * difficultyMultiplier,
      [Attribute.endurance]: baseAttributes.endurance * difficultyMultiplier,
      [Attribute.intelligence]:
        baseAttributes.intelligence * difficultyMultiplier,
      [Attribute.charisma]: baseAttributes.charisma * difficultyMultiplier,
      [Attribute.luck]: baseAttributes.luck * difficultyMultiplier,
    };
  }
}
