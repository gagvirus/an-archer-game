import {Scene} from "phaser";
import Pointer = Phaser.Input.Pointer;

class BuildMenuScene extends Scene {
    tileSize: number = 32;
    storedTiles: { [coordinate: string]: string };

    constructor() {
        super('BuildMenuScene');
    }

    create() {
        this.storedTiles = {}
        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            this.addOrRemoveTile(pointer.x, pointer.y);
        });
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'b') {
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    addOrRemoveTile(x: number, y: number, element: string = 'block') {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        const coordinate = `${tileX}x${tileY}`;
        if (this.storedTiles[coordinate]) {
            delete this.storedTiles[coordinate];
        } else {
            this.storedTiles[coordinate] = element;
        }
        this.renderElements();
    }

    renderElements() {
        Object.keys(this.storedTiles).forEach((coordinate: string) => {
            const [coordinateX, coordinateY] = coordinate.split("x");
            const positionX = parseInt(coordinateX) * this.tileSize + this.tileSize / 2;
            const positionY = parseInt(coordinateY) * this.tileSize + this.tileSize / 2;
            this.add.rectangle(positionX, positionY, this.tileSize, this.tileSize, 0x00ff00).setOrigin(0.5);
        })
    }
}

export default BuildMenuScene