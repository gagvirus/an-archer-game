## Roadmap
- ~~add stats ability~~
  - ~~on level up player gains a stat point, which they can choose between different stats:~~
    -  ~~strength + 5% damage~~
    -  ~~agility + 5% attack damage~~
    -  ~~vitality + 5% health~~
    -  ~~intelligence + 5% extra xp~~
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
- developer settings
  - xp modifier


## Todo

- ~~On pause screen, resume game on "Esc" press~~
- ~~Display the current player level in game UI~~
- ~~show current / max health~~
- ~~Have a "Stats" UI in-game (for example when clicking "C" or "S")~~
- ~~health regeneration logic~~
- ~~Floating numbers~~
  - ~~for Damage Inflicted~~
  - ~~Damage Received~~
  - ~~xp gained~~
  - ~~health replenished~~
- ~~Add "Critical Hit" logic - critical chance + critical damage (multiplier)~~
- ~~log - show text log of actions - attacked, received damage, regenerated health, gained xp, gained coins etc~~
- log improvements
  - change font
  - change text size
  - partial bold in log entries
  - partial color change in log entry (for example "inflicted **red**->50 damage)
  - format numbers in logs (show 1.5m instead of 15125555)
  - ability to "collapse" & "expand" the log
  - ability to resize the log
- Have a "Bestiary" in main menu (display list of enemies with their stats)
- Support "ASDW" movement
- Support GamePad
- Add UI for changing key bindings inside settings
- settings
  - ability to disable floating numbers
    - perhaps granularly
- Enemy "Death" animation
- Hero "Level Up" animation
- Enemy "Spawn" (birth) animation
- Fix arrow logic - currently there is a bug when multiple arrows are shot, the enemy is already defeated but after the arrow arrives at destination, XP is awarded again
- Fix portal logic - can somehow use portal multiple times by spamming enter key
- Fix regen logic
- hp regen shall be paused on different scenes - make sure not to regen hp during pause, stat select etc
  - intervals not being cleaned properly
- issues after restarting the game after death
  - hp regen setinterval is not cleared
  - errors in the console
```phaser.js?v=3ad8faf7:119974 Uncaught TypeError: Cannot read properties of null (reading 'cut')
  at HealthBar.draw (Bar.ts:62:23)
  at HealthBar.updateBar (Bar.ts:73:14)
  at Attackable.replenishHealth (gameplayer-helper.ts:106:28)
  at gameplayer-helper.ts:145:26
```
```
    phaser.js?v=3ad8faf7:46950 Uncaught TypeError: Cannot read properties of null (reading 'glTexture')
    at HealthBar.draw (Bar.ts:62:23)
    at HealthBar.updateBar (Bar.ts:73:14)
    at Attackable.replenishHealth (gameplayer-helper.ts:106:28)
    at gameplayer-helper.ts:145:26
```
- Sound effects
  - Shoot arrow (~2 samples)
  - Enemy hit (~2 samples)
  - Enemy dead (~2 samples per enemy)
  - Level up (1 sample)
  - Player hit (~3 samples)
  - Player dead (~2 samples )
