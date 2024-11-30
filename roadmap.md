# SomeGameName

## Roadmap
- add stats ability
  - on level up player gains a stat point, which they can choose between different stats:
    -  strength + 5% damage
    -  agility + 5% attack damage
    -  vitality + 5% health
    -  intelligence + 5% extra xp
- active skills
- add score
  - on enemy kill add some score
  - have a high score (local storage only for now)
  - display the score
  - add functionality for active skills which can be enabled with hotkeys, have duration and cooldown:
    - for example: double arrows for 30s, double attack speed for 30s
- building
  - add ability to build things
    - each building shall persist through levels
  - on pressing "B" game pauses and add ability to place "blocks" (placeholders for now)
- enemy walk logic
  - shall follow a target
  - implement pathfinding


## Todo

- ~~On pause screen, resume game on "Esc" press~~
- ~~Display the current player level in game UI~~
- show current / max health
- Have a "Bestiary" in main menu (display list of enemies with their stats)
- Have a "Stats" UI in-game (for example when clicking "C" or "S")
- Support "ASDW" movement
- Support GamePad
- Add UI for changing key bindings inside settings
- Enemy "Death" animation
- Hero "Level Up" animation
- Enemy "Spawn" (birth) animation
- Floating numbers for "Damage Inflicted" and "Damage Received"
- Add "Critical Hit" logic - critical chance + critical damage (multiplier)
- Fix arrow logic - currently there is a bug when multiple arrows are shot, the enemy is already defeated but after the arrow arrives at destination, XP is awarded again
- Sound effects
  - Shoot arrow (~2 samples)
  - Enemy hit (~2 samples)
  - Enemy dead (~2 samples per enemy)
  - Level up (1 sample)
  - Player hit (~3 samples)
  - Player dead (~2 samples )
