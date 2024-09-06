import {Scene} from "phaser";
import Tower from "../logic/Tower.ts";
import {dampPosition, getTileCoordinate} from "../helpers/position-helper.ts";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;

class BuildMenuScene extends Scene {
    tileSize: number = 32;
    storedTiles: Tower[][];
    towerPreview?: Tower;

    constructor() {
        super('BuildMenuScene');
    }

    create() {
        this.storedTiles = []
        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            this.addOrRemoveTile(pointer);
        });
        this.input.on('pointermove', (pointer: Pointer) => {
            this.showTowerPreview(pointer);
        });
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'b') {
                delete this.towerPreview;
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    addOrRemoveTile(position: Vector2Like) {
        const {x, y} = getTileCoordinate(position, this.tileSize);
        if (!this.storedTiles[y]) {
            this.storedTiles[y] = [];
        }
        if (this.storedTiles[y][x]) {
            this.storedTiles[y][x].destroy();
            delete this.storedTiles[y][x];
        } else {
            this.storedTiles[y][x] = this.createTower(dampPosition(position, this.tileSize));
            this.storedTiles[y][x].setDepth(y);
        }
    }

    createTower(position: Vector2Like): Tower {
        const tower = new Tower(this, position.x, position.y);
        tower.scale = this.tileSize / tower.width;
        return tower;
    }

    private showTowerPreview(position: Vector2Like) {
        const {x, y} = dampPosition(position, this.tileSize);
        if (!this.towerPreview) {
            this.towerPreview = this.createTower(position);
            this.towerPreview.alpha = 0.5;
        }
        this.towerPreview.x = x;
        this.towerPreview.y = y;
    }
}

export default BuildMenuScene