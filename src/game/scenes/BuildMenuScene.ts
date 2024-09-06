import {Scene} from "phaser";
import Tower from "../logic/Tower.ts";
import {dampPosition, getTileCoordinate, TILE_SIZE, tileCoordinateToPosition} from "../helpers/position-helper.ts";
import {isDebugMode} from "../helpers/debug-helper.ts";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;

class BuildMenuScene extends Scene {
    storedTiles: Tower[][];
    towerPreview?: Tower;
    disallowedTiles: true[][];

    constructor() {
        super('BuildMenuScene');
    }

    init(data: { occupiedTiles: Vector2Like[] }) {
        const disallowedTiles = [...data.occupiedTiles, ...this.getBorderTilesAsIgnored()]
        this.disallowedTiles = [];
        disallowedTiles.forEach(({x, y}) => {
            if (!this.disallowedTiles[x]) {
                this.disallowedTiles[x] = [];
            }
            this.disallowedTiles[x][y] = true;
        })
    }

    create() {
        isDebugMode(this.game) && this.drawGrid();

        this.storedTiles = []
        this.disallowedTiles.forEach((value, posX) => {
            value.forEach((_, posY) => {
                const {x, y} = tileCoordinateToPosition({x: posX, y: posY});
                this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000).setAlpha(0.5);
            })
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

    // add top/bottom + left/right rows / columns as disallowed tiles
    private getBorderTilesAsIgnored() {
        const borderTiles = [];
        for (let x = 0; x <= Math.floor(this.scale.width / TILE_SIZE); x++) {
            borderTiles.push({x, y: 0});
            borderTiles.push({x, y: Math.floor(this.scale.height / TILE_SIZE)});
        }
        for (let y = 0; y <= Math.floor(this.scale.height / TILE_SIZE); y++) {
            borderTiles.push({x: 0, y});
            borderTiles.push({x: Math.floor(this.scale.width / TILE_SIZE), y});
        }
        return borderTiles;
    }
}

export default BuildMenuScene