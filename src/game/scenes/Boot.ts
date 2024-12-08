import {Scene} from 'phaser';

export class Boot extends Scene {
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

        this.scene.start('Preloader');
    }
}
