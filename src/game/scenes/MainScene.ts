import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import Enemy from "../logic/Enemy.ts";
import {getRandomPositionAwayFromPoint, getTileCoordinate, TILE_SIZE} from "../helpers/position-helper.ts";
import {createAnimatedText, formatNumber} from '../helpers/text-helpers.ts';
import Portal from "../logic/Portal.ts";
import Tower from "../logic/Tower.ts";
import {addStageStartedLogEntry, LogManager} from '../helpers/log-utils.ts';
import DpsIndicator from '../logic/DpsIndicator.ts';
import {createCursorKeys} from '../helpers/keyboard-helper.ts';

class MainScene extends Scene {
    stage: number;
    enemies: Group;
    hero: Hero;
    portal: Portal;
    buildings: Group;
    logManager: LogManager;
    dpsIndicator: DpsIndicator;

    constructor() {
        // Call the Phaser.Scene constructor and pass the scene key
        super('MainScene');
    }

    // Create game objects
    create() {
        this.stage = 1;
        this.scene.get('BuildMenuScene').events.on('buildComplete', (data: { buildings: Tower[][] }) => {
            if (data.buildings) {
                data.buildings.forEach((towersRow: Tower[]) => {
                    towersRow.forEach((tower: Tower) => {
                        this.buildings.add(tower.clone(this));
                    })
                })
            }
        })
        this.scene.get('StatsScene').events.on('statsUpdated', () => {
            this.hero.attackable.registerHealthRegenerationIfNecessary()
            this.hero.attackable.setMaxHealth(this.hero.maxHealth);
            this.updateDpsIndicator();
            // update the health bar ui
            // update the health regen tick
        });
        this.events.on('levelUp', () => {
            this.updateDpsIndicator();
        })
        LogManager.getInstance(this);
        // Listener for pointer (mouse/touch) inputs
        // this.input.on('pointerdown', (pointer: Pointer) => {
        //     console.log(`Pointer down at x: ${pointer.x}, y: ${pointer.y}`);
        // });

        // Listener for keyboard inputs
        // this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
        //     console.log(`Key down: ${event.key}`);
        // });

        // Listener for pointer movement
        // this.input.on('pointermove', () => {
        //     // console.log(`Pointer moved to x: ${pointer.x}, y: ${pointer.y}`);
        // });
        this.portal = new Portal(this, 400, 400);

        // Initialize enemy group
        this.enemies = this.physics.add.group(); // Group to hold all enemies

        this.buildings = this.physics.add.group();

        // Initialize the hero in the center of the canvas
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.hero = new Hero(this, centerX, centerY);

        // Listener for keyboard inputs
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.scene.pause();
                this.scene.launch('PauseMenu');
            }

            if (event.key === 'b') {
                this.scene.pause();
                // get disabled tiles and pass to build scene
                this.scene.launch('BuildMenuScene', {occupiedTiles: this.getOccupiedTiles()});
            }

            if (event.key === 'c') {
                this.scene.pause();
                this.scene.launch('StatsScene', { statsManager: this.hero.stats });
            }
        });
        this.dpsIndicator = new DpsIndicator(this);
        this.updateDpsIndicator();
        this.startStage();
    }

    updateDpsIndicator() {
        this.dpsIndicator.setDps(formatNumber(this.hero.damagePerSecond));
    }

    getOccupiedTiles() {
        const occupiedTiles: Vector2Like[] = [];
        const objects: Sprite[] = [this.hero, this.portal, ...this.enemies.getChildren(), ...this.buildings.getChildren()] as Sprite[];
        objects.forEach((obj: Sprite) => {
            if (obj instanceof Tower) {
                occupiedTiles.push(obj.getOccupyingCoordinates());
            } else {
                const bounds = obj.getBounds();
                const minX = bounds.x;
                const maxX = bounds.x + bounds.width;
                const minY = bounds.y;
                const maxY = bounds.y + bounds.height;
                for (let x = minX; x <= maxX; x += TILE_SIZE) {
                    for (let y = minY; y <= maxY; y += TILE_SIZE) {
                        console.log('OTHER', getTileCoordinate({x, y}));
                        occupiedTiles.push(getTileCoordinate({x, y}))
                    }
                }
            }

        })
        return occupiedTiles;
    }

    onEnemyKilled() {
        if (this.enemies.countActive() < 1) {
            this.portal.setDisabled(false);
        }
    }

    startStage() {
        createAnimatedText(this, `Stage ${this.stage}`, 2000)
        this.spawnEnemies(); // Spawn more enemies for the new stage
        this.portal.setDisabled(true);
        // addStageStartedLogEntry(`Start Stage ${this.stage} - ${this.enemies.countActive(true)} enemies spawned.`);
        addStageStartedLogEntry(1, 1);
    }

    // Update game state (called every frame)
    update(time: number, delta: number) {
        // Make enemies move towards the hero and avoid collision with each other
        this.enemies.getChildren().forEach((gameObject: GameObject) => {
            (gameObject as Enemy).update(time, delta);
        });

        const cursors = createCursorKeys(this);

        // Update hero based on input
        this.hero.update(cursors, time, delta);

        // Handle hero movement
        if (cursors.left) {
            this.hero.setFlipX(true);  // Flip the sprite to face left
            this.hero.setVelocityX(-160);
        } else if (cursors.right) {
            this.hero.setFlipX(false);  // Flip the sprite to face left
            this.hero.setVelocityX(160);
        } else {
            this.hero.setVelocityX(0);
        }

        if (cursors.up) {
            this.hero.setVelocityY(-160);
        } else if (cursors.down) {
            this.hero.setVelocityY(160);
        } else {
            this.hero.setVelocityY(0);
        }

        this.portal.checkHeroIsWithinBounds(this.hero);
    }

    spawnEnemies() {
        const numEnemies = this.stage * 3; // Increase the number of enemies each stage

        for (let i = 0; i < numEnemies; i++) {
            const {
                x,
                y
            } = getRandomPositionAwayFromPoint(this.scale.width - 50, this.scale.height - 50, this.hero, 200);
            const enemy = new Enemy(this, x, y);
            this.enemies.add(enemy);
        }
    }

    nextStage() {
        this.stage += 1;   // Increase stage
        this.enemies.clear(true, true); // Clear existing enemies
        this.startStage();
    }

}

export default MainScene;
