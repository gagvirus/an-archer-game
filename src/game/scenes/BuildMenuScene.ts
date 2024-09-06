import {Scene} from "phaser";
import Tower from "../logic/Tower.ts";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {dampPosition} from "../helpers/position-helper.ts";

class BuildMenuScene extends Scene {
    tileSize: number = 32;
    storedTiles: { [coordinate: string]: string };
    towerPreview: Tower;

    constructor() {
        super('BuildMenuScene');
    }

    create() {
        this.storedTiles = {}
        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            this.addOrRemoveTile(pointer.x, pointer.y);
        });
        this.input.on('pointermove', (pointer: Pointer) => {
            this.showTowerPreview(pointer);
            // console.log(`Pointer moved to x: ${pointer.x}, y: ${pointer.y}`);
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
            const tower = new Tower(this, positionX, positionY)
            tower.scale = this.tileSize / tower.width;
        })
    }
    

    private showTowerPreview(position: Vector2Like) {
        const { x, y } = dampPosition(position, this.tileSize);
        if (!this.towerPreview)
        {
            this.towerPreview = new Tower(this, x, y);
            this.towerPreview.scale = this.tileSize / this.towerPreview.width;
            this.towerPreview.alpha = 0.5;
        }
        this.towerPreview.x = x;
        this.towerPreview.y = y;
    }
}

export default BuildMenuScene