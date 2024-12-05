import AbstractModule from './abstract-module.ts';

export enum Module
{
    fpsCounter = 'fpsCounter',
}

class ModuleManager {
    private modules: { [key: string]: { instance: AbstractModule; active: boolean } } = {};

    register(key: string, moduleInstance: AbstractModule) {
        this.modules[key] = {instance: moduleInstance, active: false};
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
