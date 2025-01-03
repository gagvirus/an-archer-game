## Roadmap

- Bug - health not being immediate update after leveling up - it's updated only after updating a stat
- Bug - sometimes "damage reduced" is being shown wrongfully while previewing stat changes
- Improve UI / UX on statistics screen (both global & per-game)
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

### Gameplay Features

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

- Achievements
  - To be detailed
  - global achievements
  - per-game achievements
  - show achievement progress
  - achievements shall grant something
  - progress of all achievements (10/200)
- city view
  - in the city shall be multiple activities
  - gameplay similar to combat, stroll around
  - talk to NPCs
    - merchant
    - blacksmith
    - etc
  - ability to purchase home
- home view
  - ability to upgrade home
    - number of trophies on display
    - number of relics to display
- challenge modifiers
  - unlocks after some time (for example going through stage 100)
  - can be unlocked with money
  - each challenge modifier makes the game more challenging, but increases the rewards
- relics
  - ability to find relics
    - during combat
    - or purchase from merchant
  - relics shall be stored in a "diablo-like" inventory
  - each relic gives some passive boost
- trophies
  - after killing an elite enemy / boss, collect it's head
  - can sell for huge money
  - keep for passive buff
  - trophy is randomized
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
- save progress / continue game
- optimization on logs - display log entries in bulk when collecting resources
  - during 3 seconds if a player collects +10, +12, +13 coins, just display one entry "collected 35 coins"
- coins / resources "clumping"
  - after some time of being dropped, combine multiple coins in a radius into one big pile

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
