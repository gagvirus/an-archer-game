import {GameObjects, Scene} from 'phaser';
import {createText} from '../helpers/text-helpers.ts';

class DpsIndicator {
    scene: Scene;
    text: GameObjects.Text;


    constructor(scene: Scene) {
        this.scene = scene;
        this.text = this.createDpsIndicator();
    }


    createDpsIndicator() {
        return createText(this.scene, '', {
            x: this.scene.scale.width - 50, // Bottom-right corner
            y: 20,
        }, 16)
    }

    setDps(amount: string) {
        this.text.setText(`DPS: ${amount}`);
    }
}

export default DpsIndicator;
