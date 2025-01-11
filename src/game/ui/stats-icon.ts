import UiIcon from "./icon.ts";
import { Scene } from "phaser";

export const renderOpenStatsIcon = (
  scene: Scene,
  onClick: () => void,
): UiIcon => {
  return new UiIcon(
    scene,
    {
      x: 50,
      y: scene.scale.height - 50,
    },
    64,
    "hand-sparkle",
    "C",
    "Open stats menu",
    () => onClick(),
  )
    .setInteractive()
    .on("pointerdown", () => onClick());
};
