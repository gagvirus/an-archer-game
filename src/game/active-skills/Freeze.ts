import AbstractSkill from "./abstract-skill.ts";
import FreezeSpell from "../game-objects/FreezeSpell.ts";

class Freeze extends AbstractSkill {
  private freezeSpell?: FreezeSpell;
  activate(): void {
    if (!this.freezeSpell) {
      this.freezeSpell = new FreezeSpell(
        this.scene,
        this.hero.attackable,
        this.targets,
      );
    } else {
      this.freezeSpell.destroy();
      this.freezeSpell = undefined;
    }
  }

  update(): void {
    this.freezeSpell?.update();
  }
}

export default Freeze;
