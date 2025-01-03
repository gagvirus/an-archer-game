// Utility functions to access game and active scene
import { StatisticsManager } from "../statistics/statistics-manager.ts";
import MainScene from "../scenes/MainScene.ts";

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

export function mainScene(): MainScene {
  const currentScene = activeScene();
  if (currentScene.scene.key !== "MainScene") {
    throw new Error("Current Scene is not MainScene");
  }
  return currentScene as MainScene;
}

export function addScore(amount: number) {
  StatisticsManager.getInstance().addScore(amount);
}

export function getScore() {
  return StatisticsManager.getInstance().getScore();
}

export function addStatistic(entryName: string, value: number) {
  StatisticsManager.getInstance().add(entryName, value);
}

export function getStatistic(entryName: string, global: boolean = false) {
  entryName = global ? `global.${entryName}` : entryName;
  return StatisticsManager.getInstance().retrieve(entryName);
}

export function resetStatistics() {
  return StatisticsManager.getInstance().resetLocalStatistics();
}
