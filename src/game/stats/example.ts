// Initial base attributes
import { Attributes } from "./attributes.ts";
import { AttributeManager } from "./attribute-manager.ts";
import { HeroLevelLayer } from "./layers/hero-level-layer.ts";
import { CoreStatsLayer } from "./layers/core-stats-layer.ts";
import { InventoryLayer } from "./layers/inventory-layer.ts";
import { HeroClassLayer } from "./layers/hero-class-layer.ts";

export function getSample() {
  const baseAttributes: Attributes = {
    agility: 0,
    charisma: 0,
    dexterity: 0,
    endurance: 0,
    fortitude: 0,
    intelligence: 0,
    luck: 0,
    perception: 0,
    strength: 0,
    armorRating: 0,
    armorRatingBonus: 0,
    attackRate: 0,
    attackSpeedBonus: 0,
    attacksPerSecond: 0,
    baseAttackTime: 0,
    criticalChancePercent: 0,
    criticalExtraDamageMultiplier: 0,
    damageMultiplier: 0,
    dropAmountModifier: 0,
    dropChanceModifier: 0,
    evadeChancePercent: 0,
    extraDamageFromOverflowAttackSpeed: 0,
    flatDamageReduction: 0,
    healthRegenPerInterval: 0,
    healthRegenerationInterval: 0,
    maxHealthMultiplier: 0,
    percentReduction: 0,
    xpGainMultiplier: 0,
    health: 0,
    armor: 0,
    damage: 0,
  };

  // Create the manager
  const attributeManager = new AttributeManager(baseAttributes);

  // Add layers
  attributeManager.addLayer(new HeroClassLayer()); // Default hero class
  attributeManager.addLayer(new HeroLevelLayer()); // Hero is level 5
  attributeManager.addLayer(new CoreStatsLayer());
  attributeManager.addLayer(new InventoryLayer({ health: 50, damage: 5 }));

  // Get final attributes
  const finalAttributes = attributeManager.getFinalAttributes();
  console.log(finalAttributes); // Output the final calculated attributes
  return finalAttributes;
}
