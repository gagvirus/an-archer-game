import {Scene} from 'phaser';
import {ISceneLifecycle} from "../ISceneLifecycle.ts";

export class Boot extends Scene implements ISceneLifecycle {
  constructor() {
    super('Boot');
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
  }

  create() {
    this.game.registry.set('debugMode', localStorage.getItem('debugMode'));
    this.game.registry.set('autoAttack', localStorage.getItem('autoAttack'));
    this.game.registry.set('easyMode', localStorage.getItem('easyMode'));
    this.game.registry.set('rapidLevelUp', localStorage.getItem('rapidLevelUp'));

    this.scene.start('Preloader');
  }
}
