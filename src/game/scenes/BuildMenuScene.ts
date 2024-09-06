import {Scene} from "phaser";
import Tower from "../logic/Tower.ts";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {dampPosition} from "../helpers/position-helper.ts";

class BuildMenuScene extends Scene {
    tileSize: number = 32;
    storedTiles: { [coordinate: string]: Tower };
    towerPreview: Tower;

    constructor() {
        super('BuildMenuScene');
    }

    create() {
        this.storedTiles = {}
        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            this.addOrRemoveTile(pointer);
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

    addOrRemoveTile(position: Vector2Like) {
        const coordinate = this.positionToCoordinate(position);
        if (this.storedTiles[coordinate]) {
            this.storedTiles[coordinate].destroy();
            delete this.storedTiles[coordinate];
        } else {
            this.storedTiles[coordinate] = this.createTower(position);
        }
    }
    
    coordinateToPosition(coordinate: string): Vector2Like
    {
        const [coordinateX, coordinateY] = coordinate.split("x");
        return {
            x: parseInt(coordinateX) * this.tileSize + this.tileSize / 2,
            y: parseInt(coordinateY) * this.tileSize + this.tileSize / 2,
        }
    }
    
    positionToCoordinate(position: Vector2Like): string
    {
        const tileX = Math.floor(position.x / this.tileSize);
        const tileY = Math.floor(position.y / this.tileSize);
        return `${tileX}x${tileY}`;
    }
    
    createTower(position: Vector2Like): Tower
    {
        const { x, y } = dampPosition(position, this.tileSize);
        const tower = new Tower(this, x, y);
        tower.scale = this.tileSize / tower.width;
        return tower;
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