import AbstractModule from './abstract-module.ts';
import {createText} from '../helpers/text-helpers.ts';

class FpsCounterModule extends AbstractModule {
    private fpsText?: Phaser.GameObjects.Text;

    start() {
        if (!this.fpsText) {
            this.fpsText = createText(this.scene, 'FPS: 0', {
                x: this.scene.scale.width - 50,
                y: 50,
            }, 16)
        }
    }

    stop() {
        if (this.fpsText) {
            this.fpsText.destroy();
            this.fpsText = undefined;
        }
    }

    update() {
        if (this.fpsText) {
            const fps = Math.round(this.scene.game.loop.actualFps);
            this.fpsText.setText(`FPS: ${fps}`);
        }
    }
}

export default FpsCounterModule;
