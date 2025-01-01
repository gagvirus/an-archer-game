import AbstractGameplayScene from "./AbstractGameplayScene.ts";

class PlaygroundScene extends AbstractGameplayScene {
  constructor() {
    super("PlaygroundScene");
  }

  protected registerEventListeners() {
    super.registerEventListeners();
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (["1", "2"].includes(event.key)) {
        const skillsMap = {
          "1": "freeze",
          "2": "barrage",
        };
        console.log(skillsMap[event.key as "1" | "2"]);
      }
    });
  }
}

export default PlaygroundScene;
