## Roadmap

- powerups
    - e.g. double damage, invulnerability, fast speed (Attack speed, movement speed)
- different heroes
    - one is faster, one is tank, one is glass cannon etc
- active skills
    - e.g. freeze in a radius, nuke in a radius etc
- add score
    - on enemy kill add some score
    - have a high score (local storage only for now)
    - display the score
    - add leaderboards (backend)
- add functionality for active skills which can be enabled with hotkeys, have duration and cool-down:
    - for example: double arrows for 30s, double attack speed for 30s
- building
    - add ability to build things
        - each building shall persist through levels
    - on pressing "B" game pauses and add ability to place "blocks" (placeholders for now)
- enemy walk logic
    - shall follow a target
    - implement pathfinding
    - some enemies (for example ghosts) shall be able to pass barriers
- developer settings
    - xp modifier
- display number of unallocated stat points without opening stats page
- bug - damage is not applied immediately after allocating stat - it's active after allocating and then leveling up
- ability to select stats with keyboard
- hero attack range
- enemy up-scaling
- rename levels to stages
- server side:
    - ability to login via itch
    - ability to set username
    - save score
- show stage info
    - what stage are you on
    - how many total enemies / remaining enemies are there

## Todo

- resource / coin gain
- bartering / coin spending
- bulk allocate points
- un-allocate points
    - bulk un-allocate points
- game stats (per run)
    - how long have played
    - how much coin collected
    - how much damage inflicted
    - how many enemies killed
    - how much damage received
- achievements
    - tbd
- on stats screen (on pressing **c**) display list of affected stats (e.g. extra damage multiplier etc.)
- difficulty slider in settings
- log improvements
    - partial bold in log entries
    - partial color change in log entry (for example "inflicted **red**->50 damage")
    - format numbers in logs (show 1.5m instead of 15125555)
    - ability to "collapse" & "expand" the log
    - ability to resize the log
    - copy log contents
- Have a "Bestiary" in main menu (display list of enemies with their stats)
- Support GamePad
- Add UI for changing key bindings inside settings
- settings
    - ability to disable floating numbers
        - perhaps granular
- Enemy "Death" animation
- Hero "Level Up" animation
- Enemy "Spawn" (birth) animation
- Fix arrow logic - currently there is a bug when multiple arrows are shot, the enemy is already defeated but after the
  arrow arrives at destination, XP is awarded again
- Fix portal logic - can somehow use portal multiple times by spamming enter key
- Fix regen logic
- hp regen shall be paused on different scenes - make sure not to regen hp during pause, stat select etc
    - intervals not being cleaned properly
- issues after restarting the game after death
    - hp regen setInterval is not cleared
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
