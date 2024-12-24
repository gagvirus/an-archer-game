// Initial base attributes
import { Attribute, Attributes } from "./attributes.ts";
import { AttributeManager } from "./attribute-manager.ts";
import { HeroLevelLayer } from "./layers/hero-level-layer.ts";
import { CoreStatsLayer } from "./layers/core-stats-layer.ts";
import { HeroClassLayer } from "./layers/hero-class-layer.ts";
import { StatsLayer } from "./layers/stats-layer.ts";

export function getSample() {
  const baseAttributes: Attributes = {
    [Attribute.agility]: 0,
    [Attribute.armor]: 0,
    [Attribute.armorRating]: 0,
    [Attribute.attackRate]: 0,
    [Attribute.barter]: 0,
    [Attribute.baseAttackTime]: 0,
    [Attribute.charisma]: 0,
    [Attribute.criticalAmount]: 0,
    [Attribute.criticalRate]: 0,
    [Attribute.damage]: 0,
    [Attribute.dexterity]: 0,
    [Attribute.dropAmount]: 0,
    [Attribute.dropRate]: 0,
    [Attribute.endurance]: 0,
    [Attribute.evadeRating]: 0,
    [Attribute.fortitude]: 0,
    [Attribute.health]: 0,
    [Attribute.healthRegen]: 0,
    [Attribute.healthRegenInterval]: 0,
    [Attribute.intelligence]: 0,
    [Attribute.luck]: 0,
    [Attribute.perception]: 0,
    [Attribute.strength]: 0,
    [Attribute.xpRate]: 0,
  };

  // Create the manager
  const attributeManager = new AttributeManager(baseAttributes);

  // Add layers
  attributeManager.addLayer(new HeroClassLayer()); // Default hero class
  attributeManager.addLayer(new HeroLevelLayer()); // Hero is level 5
  attributeManager.addLayer(new CoreStatsLayer());
  attributeManager.addLayer(new StatsLayer());
  // attributeManager.addLayer(new InventoryLayer({ health: 50, damage: 5 }));

  // Get final attributes
  const finalAttributes = attributeManager.getFinalAttributes();
  console.log(finalAttributes); // Output the final calculated attributes
  return finalAttributes;
}
