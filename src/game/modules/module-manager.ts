import {Scene} from "phaser";

export enum Module {
    fpsCounter = "fpsCounter",
    dpsIndicator = "dpsIndicator",
    logs = "logs",
    stageInfo = "stageInfo",
    resourceList = "resourceList",
}

export abstract class AbstractModule {
    protected scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    abstract start(): void;

    abstract stop(): void;

    abstract update(): void;
}

class ModuleManager {
    private modules: { [key: string]: { instance: AbstractModule; active: boolean } } = {};
    private scene: Scene;
    private static _instance: ModuleManager;

    private constructor() {
    }

    static getInstance(scene?: Scene) {
        if (!ModuleManager._instance) {
            ModuleManager._instance = new ModuleManager();
            ModuleManager._instance.scene = scene as Scene;
        }
        return ModuleManager._instance;
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    getScene(): Scene {
        return this.scene;
    }

    register(key: string, moduleInstance: AbstractModule) {
        this.modules[key] = {instance: moduleInstance, active: false};
    }

    getModule<T extends AbstractModule>(key: string): T | null {
        if (this.modules[key]) {
            return this.modules[key].instance as T;
        }
        return null;
    }

    getModuleIfActive<T extends AbstractModule>(key: string): T | null {
        if (this.modules[key] && this.modules[key].active) {
            return this.modules[key].instance as T;
        }
        return null;
    }

    enable(key: string) {
        if (this.modules[key] && !this.modules[key].active) {
            this.modules[key].instance.start();
            this.modules[key].active = true;
        }
    }

    toggle(key: string) {
        if (this.modules[key]) {
            if (this.modules[key].active) {
                this.disable(key);
            } else {
                this.enable(key);
            }
        }
    }

    disable(key: string) {
        if (this.modules[key] && this.modules[key].active) {
            this.modules[key].instance.stop();
            this.modules[key].active = false;
        }
    }

    update() {
        Object.values(this.modules)
            .filter((module) => module.active)
            .forEach((module) => {
                if (module.instance.update) {
                    module.instance.update();
                }
            });
    }
}

export default ModuleManager;
