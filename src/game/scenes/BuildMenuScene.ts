import {Scene} from "phaser";
import Tower from "../logic/Tower.ts";
import {dampPosition, getTileCoordinate, TILE_SIZE, tileCoordinateToPosition} from "../helpers/position-helper.ts";
import {isDebugMode} from "../helpers/debug-helper.ts";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;

class BuildMenuScene extends Scene {
    storedTiles: Tower[][];
    towerPreview?: Tower;
    occupiedTiles: Vector2Like[];

    constructor() {
        super('BuildMenuScene');
    }

    init(data: { occupiedTiles: string[] }) {
        this.occupiedTiles = data.occupiedTiles.map((p) => ({
            x: parseInt(p.split('x')[0]),
            y: parseInt(p.split('x')[1])
        }));
        // todo: add top/bottom + left/right rows / columns as disallowed tiles
    }

    create() {
        isDebugMode(this.game) && this.drawGrid();

        this.storedTiles = []
        this.occupiedTiles.forEach((occupiedTile: Vector2Like) => {
            const {x, y} = tileCoordinateToPosition(occupiedTile);
            this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000).setAlpha(0.5);
        })
        // Listener for pointer (mouse/touch) inputs
        this.input.on('pointerdown', (pointer: Pointer) => {
            this.addOrRemoveTile(pointer);
        });
        this.input.on('pointermove', (pointer: Pointer) => {
            this.showTowerPreview(pointer);
        });
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'b') {
                // todo: pass the buildings to the main scene
                delete this.towerPreview;
                this.scene.resume('MainScene')
                this.scene.stop();
            }
        });
    }

    addOrRemoveTile(position: Vector2Like) {
        const {x, y} = getTileCoordinate(position);
        if (!this.storedTiles[y]) {
            this.storedTiles[y] = [];
        }
        if (this.storedTiles[y][x]) {
            this.storedTiles[y][x].destroy();
            delete this.storedTiles[y][x];
        } else {
            // todo: disallow placing towers on disallowed tiles
            this.storedTiles[y][x] = this.createTower(dampPosition(position));
            this.storedTiles[y][x].setDepth(y);
        }
    }

    createTower(position: Vector2Like): Tower {
        const tower = new Tower(this, position.x, position.y);
        tower.setScale(TILE_SIZE / tower.width);
        return tower;
    }

    private showTowerPreview(position: Vector2Like) {
        const {x, y} = dampPosition(position);
        if (!this.towerPreview) {
            this.towerPreview = this.createTower(position);
            this.towerPreview.alpha = 0.5;
        }
        // todo: hide tower preview if on disallowed tile
        this.towerPreview.x = x;
        this.towerPreview.y = y;
        this.towerPreview.update();
    }

    private drawGrid() {
        // todo: show numbers on top/bottom + left/right rows + columns
        for (let x = 0; x <= this.scale.width; x += TILE_SIZE) {
            for (let y = 0; y <= this.scale.height; y += TILE_SIZE) {
                this.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE).setStrokeStyle(1, 0xffffff);
            }
        }
    }
}

export default BuildMenuScene