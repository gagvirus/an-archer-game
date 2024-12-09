import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.Physics.Arcade.Group;
import Sprite = Phaser.GameObjects.Sprite;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import Tile = Phaser.Tilemaps.Tile;
import {Scene} from "phaser";
import Hero from "../logic/Hero.ts";
import Enemy from "../logic/Enemy.ts";
import {getRandomPositionAwayFromPoint, getTileCoordinate, TILE_SIZE} from "../helpers/position-helper.ts";
import {createAnimatedText, formatNumber, pluralize, showCollectedLoot} from "../helpers/text-helpers.ts";
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
import {Soul} from "../logic/Soul.ts";
import {ResourceDrop, ResourceType} from "../logic/ResourceDrop.ts";
import ResourceListModule from "../modules/resource-list-module.ts";
import {getRandomNumberBetweenRange, randomChance} from "../helpers/random-helper.ts";
import {ResourceDropChance} from "../logic/enemies.ts";

class MainScene extends Scene {
    private moduleManager!: ModuleManager;

    stage: number;
    enemies: Group;
    hero: Hero;
    portal: Portal;
    buildings: Group;
    drops: Group;
    dropsFollowing: Group;

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

        this.drops = this.physics.add.group();
        this.dropsFollowing = this.physics.add.group();

        this.physics.add.overlap(this.hero.collectLootCircle, this.drops, this.onResourcePull, undefined, this);

        // Register modules
        this.moduleManager.register(Module.fpsCounter, new FpsCounterModule(this));
        this.moduleManager.register(Module.dpsIndicator, new DpsIndicatorModule(this, this.hero));
        this.moduleManager.register(Module.stageInfo, new StageInfoModule(this));
        this.moduleManager.register(Module.resourceList, new ResourceListModule(this, this.hero));
        // cleanup any previous logs
        LogModule.cleanEntries();
        this.moduleManager.register(Module.logs, new LogModule(this));
        // Enable the FPS counter initially
        this.moduleManager.enable(Module.fpsCounter);
        this.moduleManager.enable(Module.dpsIndicator);
        this.moduleManager.enable(Module.logs);
        this.moduleManager.enable(Module.stageInfo);
        this.moduleManager.enable(Module.resourceList);

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

    onResourcePull(_: Tile | GameObjectWithBody, resource: Tile | GameObjectWithBody) {
        // if drop is not following hero, add to "follow list"
        if (!this.dropsFollowing.contains(resource as GameObject)) {
            (resource as ResourceDrop).setStartedPulling();
            this.dropsFollowing.add(resource as GameObject);
        }
    }

    dropsFollowHero() {
        this.dropsFollowing.getChildren().forEach((drop) => {
            // Calculate the direction to pull the resource
            const {x, y, amount, resourceName: name, startedPulling} = drop as ResourceDrop;
            const {body} = drop as GameObjectWithBody;

            const elapsedTime = (Date.now() - startedPulling) / 1000;
            const angle = Phaser.Math.Angle.Between(x, y, this.hero.x, this.hero.y);

            const pullX = Math.cos(angle) * this.hero.pullForce * elapsedTime;
            const pullY = Math.sin(angle) * this.hero.pullForce * elapsedTime;

            body.velocity.x = pullX;
            body.velocity.y = pullY;

            // Check if the resource is within collectDistance
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, x, y);
            if (distance < this.hero.collectDistance) {
                this.dropsFollowing.remove(drop as ResourceDrop, true, true);
                this.drops.remove(drop as ResourceDrop);
                this.hero.collectResource(name as ResourceType, amount);
                addLogEntry("Collected :amount :name", {
                    amount: [formatNumber(amount), COLOR_WARNING],
                    name: [pluralize(amount, name), COLOR_WARNING],
                }, LogEntryCategory.Loot);
                showCollectedLoot(this, this.hero, name, amount);
            }
        });
    }

    spawnSoul(x: number, y: number, amount: number = 1) {
        return new Soul(this, x, y, amount);
    }

    spawnCoin(x: number, y: number, amount: number = 1) {
        return new Coin(this, x, y, amount);
    }

    getDropFromType(x: number, y: number, type: ResourceType, amount: number): ResourceDrop {
        switch (type) {
            case ResourceType.soul:
                return this.spawnSoul(x, y, amount);
            case ResourceType.coin:
            default:
                return this.spawnCoin(x, y, amount);
        }
    }

    drop(x: number, y: number, type: ResourceType, amount: number) {
        const drop: ResourceDrop = this.getDropFromType(x, y, type, amount);
        this.drops.add(drop);
        // Randomize direction and distance for the throw
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); // Random direction
        const radius = Phaser.Math.FloatBetween(50, 100); // Distance to "throw"

        const targetX = x + Math.cos(angle) * radius;
        const targetY = y + Math.sin(angle) * radius;

        // Set the drop's velocity to "throw" it
        const throwSpeed = 200; // Speed of the throw
        const velocityX = Math.cos(angle) * throwSpeed;
        const velocityY = Math.sin(angle) * throwSpeed;

        (drop as GameObjectWithBody).body.velocity.set(velocityX, velocityY);

        // Optional: Add a tween for a smooth "throw" animation
        this.scene.scene.tweens.add({
            targets: drop,
            x: targetX,
            y: targetY,
            ease: 'Power2',
            duration: 500,
            onComplete: () => {
                // Stop the drop after it lands
                (drop as GameObjectWithBody).body.velocity.set(0, 0);
            }
        });
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

    onEnemyKilled(enemy: Enemy) {
        this.dropLoot(enemy);
        if (this.enemies.countActive() < 1) {
            this.portal.setDisabled(false);
        }
    }

    dropLoot(enemy: Enemy) {
        const {dropChanceModifier, dropAmountModifier} = this.hero.stats;
        Object.keys(enemy.drops).forEach((resourceType) => {
            const [baseMinAmount, baseMaxAmount, baseChance] = enemy.drops[resourceType as ResourceType] as ResourceDropChance;
            const minAmount = baseMinAmount * dropAmountModifier;
            const maxAmount = baseMaxAmount * dropAmountModifier;
            const chance = Phaser.Math.Clamp(baseChance * dropChanceModifier, 1, baseChance <= 10 ? 50 : 90);
            if (randomChance(chance)) {
                const amount = getRandomNumberBetweenRange([minAmount, maxAmount] as [number, number]);
                this.drop(enemy.x, enemy.y, resourceType as ResourceType, amount)
            }
        });

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
        this.dropsFollowHero();
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
