import {Boot} from "./scenes/Boot";
import {GameOver} from "./scenes/GameOver";
import {MainMenu} from "./scenes/MainMenu";
import {AUTO, Game} from "phaser";
import {Preloader} from "./scenes/Preloader";
import MainScene from "./scenes/MainScene.ts";
import {PauseMenu} from "./scenes/PauseMenu.ts";
import SettingsScene from "./scenes/SettingsScene.ts";
import BuildMenuScene from "./scenes/BuildMenuScene.ts";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

import StatsScene from "./scenes/StatsScene/StatsScene.ts";
import {setGame} from "./helpers/accessors.ts";
import StatisticsScene from "./scenes/StatisticsScene.ts";
import HeroSelectScene from "./scenes/HeroSelectScene.ts";
import PlaygroundScene from "./scenes/PlaygroundScene.ts";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.RESIZE, // Enables the game to resize automatically
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game horizontally and vertically
  },
  backgroundColor: "#2d2d2d", // Background color of the canvas
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    SettingsScene,
    GameOver,
    MainScene,
    BuildMenuScene,
    PauseMenu,
    StatsScene,
    StatisticsScene,
    HeroSelectScene,
    PlaygroundScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const StartGame = (parent: string) => {
  const gameInstance = new Game({ ...config, parent });
  setGame(gameInstance);
  return gameInstance;
};

export default StartGame;
