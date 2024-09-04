import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';

export class MainMenu extends Scene {
    title: GameObjects.Text;
    startGame: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.title = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        this.startGame = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        this.startGame.setInteractive()
        
        this.startGame.on('pointerdown', () => {
            this.scene.start('MainScene')
        });


        EventBus.emit('current-scene-ready', this);
    }
}
