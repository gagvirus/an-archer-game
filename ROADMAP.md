## Roadmap

### Bugs & Improvements

- Fix portal logic - can somehow use portal multiple times by spamming enter key
- Crashing bug related to picking up powerups
  - Uncaught TypeError: Cannot read properties of null (reading 'worldToLocal')
  - the issue occurs when collected multiple instanced of the same powerup and one of them expires
  - throwing errors in console when first duplicate expires
  - game crashes when picking up a new powerup after this
- stats management - better ui / ux for viewing child stats & attributes
- automatically update child stats / attributes on core stat change
- display a preview of altered attributes & stats on hover of core stat (e.g. green +5 damage when hovering core stat)
- display a help icon "Enter" when portal is ready
- auto-proceed to next level
- display an icon that shall open stats screen on click (hand-sparkle)
- optimization on logs - display log entries in bulk when collecting resources
  - during 3 seconds if a player collects +10, +12, +13 coins, just display one entry "collected 35 coins"
- coins / resources "clumping"
  - after some time of being dropped, combine multiple coins in a radius into one big pile
- resources drop count: currently, based on the luck attribute we may drop up to *5 resource. add a setting in settings
  scene, which will allow disabling the functionality (for performance perspective)

### Gameplay Features

- Active skills
  - when the player reaches certain level (e.g. 5, 15, 25, 50), allow the player to select one of the skills
  - can be enabled by clicking on correct buttons, displayed on the screen (e.g. icons on bottom-left)
  - can be enabled by hotkeys (e.g. 1, 2, 3 etc)
  - each skill shall have a different stats:
    - duration
    - effect radius
    - cool-down
  - for start, it could be just a few, e.g.:
    - freeze
    - nuke
    - buff to self
    - debuff to enemies
- Enemy walk logic
  - shall follow a target
  - implement pathfinding
  - some enemies (for example ghosts) shall be able to pass barriers
- Enemy up-scaling
- Hero attack range
- Ability to spend coin / resources
  - To be details
  - e.g. use coins to upgrade skills
  - e.g. use souls to re-allocate stat points

### Menus / Settings/ Meta

- Scoring
  - On enemy kill add some score
  - Display the score on top-right corner
  - On game over, show some details
    - show how many stages passed
    - how much score have gained
- Per-Game Statistics
  - Collect information regarding the current run / game
    - how long have played
    - how much damage inflicted
    - how many enemies killed
    - how much damage received
    - how many levels gained
    - how many stages passed
    - how many resources collected
  - Total Statistics
    - combine all the collected data and calculate sum
    - have a page "stats" that shall just display all this info
  - Achievements
    - To be detailed
- Leaderboards
  - 1st Step - Local - Table containing the following columns:
    - name (just "Hero" for now)
    - level
    - stages passed
    - score
    - stats
  - Global leaderboards
    - Separate service which will store all the necessary data
    - Return the top 100
    - Return when on the leaderboard the current player is
- Add multiple heroes
  - can be the same sprite / animations, just with different color / tint
  - hero types (examples):
    - Speedster (bonus to movement & attack speed)
    - Tank (higher HP / armor rating / HP regen)
    - Glass Cannon (smaller HP pool / immensely high DPS)
- Game Difficulty
- Add UI for changing key bindings inside settings
- settings
  - ability to disable floating numbers
    - perhaps granular
- Have a "Bestiary" in main menu (display list of enemies with their stats)
- Building
  - add ability to build things
    - each building shall persist through levels
  - on pressing "B" game pauses and add ability to place "blocks" (placeholders for now)
- server side:
  - ability to login via itch
  - ability to set username
  - save score
- add functionality for resolution
  - currently, the game is rendered at current window size, and game depends on window size in some places
  - change the logic to not depend on window size in any places
  - create some logic, that will allow to switch game resolution, on which we shall depend
  - have the game "upscale" / "downscale" on pre-defined set of resolution (hd / full hd etc)

### Aesthetics

- Enemy
  - "Death" animation
  - "Spawn" (birth) animation
  - Sound Effects
    - Death (~2 samples per enemy)
    - Hurt (~2 samples per enemy)
- Hero
  - "Level Up" animation
  - Sound Effects
    - Shoot arrow (~2 samples)
    - Level up (1 sample)
    - Hit / Oomph (~2 samples)
    - Hurt (~3 samples)
    - Death (~2 samples )
- Support GamePad
