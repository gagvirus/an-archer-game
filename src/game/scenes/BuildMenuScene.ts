import {Scene} from "phaser";

class BuildMenuScene extends Scene {
    constructor() {
        super('BuildMenuScene');
    }

    create() {
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'b') {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }
}

export default BuildMenuScene