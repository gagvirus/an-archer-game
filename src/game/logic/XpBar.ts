import Bar from "./Bar.ts";
import {HEX_COLOR_GREY, HEX_COLOR_WARNING} from "../helpers/colors.ts";
import Vector2Like = Phaser.Types.Math.Vector2Like;

class XpBar extends Bar {
    level: number;
    unallocatedStats: number;

    constructor(scene: Phaser.Scene, position: Vector2Like, width: number, height: number, level: number, currentXp: number, xpToNextLevel: number, positionOffset?: Vector2Like) {
        super(scene, position, width, height, xpToNextLevel, currentXp, positionOffset, HEX_COLOR_WARNING, HEX_COLOR_GREY, true)
        this.level = level;
    }

    formatText(): string {
        const xpText = super.formatText();
        const unallocatedStatsText = this.unallocatedStats > 0 ? `[${this.unallocatedStats}]` : "";
        return `Level ${this.level} (${xpText}) ${unallocatedStatsText}`;
    }

    setUnallocatedStats(amount: number) {
        this.unallocatedStats = amount;
        this.updateBar(this.currentValue, this.maxValue);
        return this;
    }

    setLevel(amount: number) {
        this.level = amount;
        this.updateBar(this.currentValue, this.maxValue);
        return this;
    }
}

export default XpBar;
