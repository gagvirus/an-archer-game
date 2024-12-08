import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import Enemy from "../logic/Enemy.ts";
import {getRandomPositionAwayFromPoint, getTileCoordinate, TILE_SIZE} from "../helpers/position-helper.ts";
import {createAnimatedText} from "../helpers/text-helpers.ts";
import Portal from "../logic/Portal.ts";
import Tower from "../logic/Tower.ts";
import {addLogEntry, LogEntryCategory} from "../helpers/log-utils.ts";
import {createCursorKeys} from "../helpers/keyboard-helper.ts";
import ModuleManager, {Module} from "../modules/module-manager.ts";
import FpsCounterModule from "../modules/fps-counter-module.ts";
import DpsIndicatorModule from "../modules/dps-indicator-module.ts";
import LogModule from "../modules/log-module.ts";
import {COLOR_WARNING} from "../helpers/colors.ts";
import {isDebugMode} from "../helpers/registry-helper.ts";
import StageInfoModule from "../modules/stage-info-module.ts";
import {Coin} from "../logic/Coin.ts";

class MainScene extends Scene {
    private moduleManager!: ModuleManager;

    stage: number;
    enemies: Group;
    hero: Hero;
    portal: Portal;
    buildings: Group;

    constructor() {
        // Call the Phaser.Scene constructor and pass the scene key
        super("MainScene");
    }

    // Create game objects
    create() {
        // Initialize the module manager
        this.moduleManager = ModuleManager.getInstance(this);
        // initialize the portal
        this.portal = new Portal(this, 400, 400);
        // Initialize the hero in the center of the canvas
        this.hero = new Hero(this, this.scale.width / 2, this.scale.height / 2);

        new Coin(this, 300, 300);

        // Register modules
        this.moduleManager.register(Module.fpsCounter, new FpsCounterModule(this));
        this.moduleManager.register(Module.dpsIndicator, new DpsIndicatorModule(this, this.hero));
        this.moduleManager.register(Module.stageInfo, new StageInfoModule(this));
        // cleanup any previous logs
        LogModule.cleanEntries();
        this.moduleManager.register(Module.logs, new LogModule(this));
        // Enable the FPS counter initially
        this.moduleManager.enable(Module.fpsCounter);
        this.moduleManager.enable(Module.dpsIndicator);
        this.moduleManager.enable(Module.logs);
        this.moduleManager.enable(Module.stageInfo);

        this.stage = 1;
        this.scene.get("BuildMenuScene").events.on("buildComplete", (data: { buildings: Tower[][] }) => {
            if (data.buildings) {
                data.buildings.forEach((towersRow: Tower[]) => {
                    towersRow.forEach((tower: Tower) => {
                        this.buildings.add(tower.clone(this));
                    })
                })
            }
        })

        this.scene.get("StatsScene").events.on("statsUpdated", () => {
            this.hero.attackable.registerHealthRegenerationIfNecessary()
            this.hero.attackable.setMaxHealth(this.hero.maxHealth);
            this.hero.attackable.attackDamage = this.hero.attackDamage;
            this.hero.attackable.attacksPerSecond = this.hero.attacksPerSecond;
            this.hero.xpManager.xpBar.setUnallocatedStats(this.hero.stats.unallocatedStats);
            // update the health bar ui
            // update the health regen tick
        });

        // Initialize enemy group
        this.enemies = this.physics.add.group(); // Group to hold all enemies

        this.buildings = this.physics.add.group();

        this.events.on("resume", () => {
            this.hero.attackable.registerHealthRegenerationIfNecessary();
        });

        // Listener for keyboard inputs
        this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                this.pauseCurrentScene();
                this.scene.launch("PauseMenu");
            }

            if (event.key === "b") {
                this.pauseCurrentScene();
                // get disabled tiles and pass to build scene
                this.scene.launch("BuildMenuScene", {occupiedTiles: this.getOccupiedTiles()});
            }

            if (event.key === "c") {
                this.pauseCurrentScene();
                this.scene.launch("StatsScene", {statsManager: this.hero.stats});
            }

            if (event.key === "k") {
                if (isDebugMode(this.game)) {
                    this.hero.attackable.takeDamage(Infinity);
                }

            }

            if (event.key == "f") {
                this.moduleManager.toggle(Module.fpsCounter);
            }

            if (event.key == "g") {
                this.moduleManager.toggle(Module.dpsIndicator);
            }

            if (event.key == "l") {
                this.moduleManager.toggle(Module.logs);
            }
        });
        this.startStage();
    }

    pauseCurrentScene() {
        this.scene.pause();
        this.hero.attackable.stopRegeneration();
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
                        console.log("OTHER", getTileCoordinate({x, y}));
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
        this.portal.setDisabled(true);
        createAnimatedText(this, `Stage ${this.stage}`, 2000)
        this.spawnEnemies(); // Spawn more enemies for the new stage
        addLogEntry("Start Stage :stage - :enemies_count enemies spawned.", {
            stage: [this.stage, COLOR_WARNING],
            enemies_count: [this.enemies.countActive(true), COLOR_WARNING],
        }, LogEntryCategory.World);
    }

    // Update game state (called every frame)
    update(time: number, delta: number) {
        this.moduleManager.update();

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

    get enemiesForStage() {
        return this.stage * 3;
    }

    spawnEnemies() {
        const numEnemies = this.enemiesForStage; // Increase the number of enemies each stage

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
