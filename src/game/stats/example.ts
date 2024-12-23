// Initial base attributes
import { Attributes } from "./attributes.ts";
import { AttributeManager } from "./attribute-manager.ts";
import { HeroLevelLayer } from "./layers/hero-level-layer.ts";
import { StatsLayer } from "./layers/stats-layer.ts";
import { InventoryLayer } from "./layers/inventory-layer.ts";

const baseAttributes: Attributes = { health: 100, armor: 10, damage: 15 };

// Create the manager
const attributeManager = new AttributeManager(baseAttributes);

// Add layers
attributeManager.addLayer(new HeroLevelLayer(5)); // Hero is level 5
attributeManager.addLayer(
  new StatsLayer({ strength: 10, dexterity: 8, intelligence: 12 }),
);
attributeManager.addLayer(new InventoryLayer({ health: 50, damage: 5 }));

// Get final attributes
const finalAttributes = attributeManager.getFinalAttributes();
console.log(finalAttributes); // Output the final calculated attributes
