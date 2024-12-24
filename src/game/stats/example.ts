// Initial base attributes
import { AttributeManager } from "./attribute-manager.ts";

export function getSample() {
  // Create the manager
  const attributeManager = new AttributeManager();

  // Get final attributes
  const finalAttributes = attributeManager.getFinalAttributes();
  console.log(finalAttributes); // Output the final calculated attributes
  return finalAttributes;
}
