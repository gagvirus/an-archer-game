// rex-ui-plugin.d.ts
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

// Extend Phaser.Scene definition to include rexUI plugin
declare module "phaser" {
  interface Scene {
    rexUI: RexUIPlugin;
  }
}
