import {Scene} from "phaser";

const createCenteredText = (scene: Scene, text: string, verticalOffset: number = 0, fontSize: number = 32, isInteractive: boolean = false) => {
    const textObject = scene.add.text(window.innerWidth / 2, window.innerHeight / 2 + verticalOffset, text, {
        fontFamily: 'Arial Black', fontSize: fontSize, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5).setDepth(100)
    
    if (isInteractive)
    {
        textObject.setInteractive();
    }
    
    return textObject
}

export {createCenteredText};