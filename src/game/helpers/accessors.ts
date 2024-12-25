// Utility functions to access game and active scene
let gameInstance: Phaser.Game | null = null;

export function setGame(instance: Phaser.Game): void {
  gameInstance = instance;
}

export function game(): Phaser.Game {
  if (!gameInstance) {
    throw new Error(
      "Game instance is not set. Make sure to call setGame(gameInstance) during initialization.",
    );
  }
  return gameInstance;
}

export function activeScene(): Phaser.Scene {
  const currentScene = game().scene.getScenes(true)[0];
  if (!currentScene) {
    throw new Error("No active scene found.");
  }
  return currentScene;
}
