## Roadmap

### Bugs & Improvements

- Attack speed and armor rating improvements
    - instead of plain calculating the attacks per second and damage reduction percent, must define some logic, that
      will return some numerical value (for example base attack speed is 50, each agility stat increases +5). have a
      getter "get attack speed" which will return this number. then this number will be combined with the base stat,
      will also add stat from item in future, and calculate attacks per second based on this. the correlation between
      attack speed and attacks per second shall not be linear, instead the increase amount shall decline the higher the
      number is.
- Attack speed issues
    - when the attack speed is very high, it causes lag / instability
    - have a max attack speed limit constant
    - when limit is reached, increment damage instead of attack speed
    - ensure calculate the damage boost amount in a way that it would add same DPS as attack speed would add

### Gameplay Features

- show stage info
    - what stage are you on
    - how many total enemies / remaining enemies are there
- Ability to un-allocate points
    - Hold Alt then click on stat, shall un-allocate
    - While holding "Alt" key, change the Green "Plus" to a Red "Minus"
    - Add ability to un-allocate points in bulk
- Drops - Coins / Resources
    - When killing an enemy, it shall have a chance to drop some resources
        - Coins - Display a number of total coins on top-right corner
        - Souls - Display a number of total souls on top-right corner
    - Shall have a "dictionary" where each type of resource is defined
    - Each enemy shall define what resource it can drop and with what probability
    - "Thoughtfulness" stat shall increase number of resources gained
    - "Thoughtfulness" stat shall increase chances of resource drops
    - In game statistics, add how much coin collected
- Powerups
    - Add functionality that will spawn powerups, which the player can collect and activate
    - Powers shall be the following
        - Double damage - provide double damage for 30 seconds
        - Invulnerability - hero becomes invulnerable for 30 seconds
        - Fast speed - increases hero's attack speed by 3 and hero's movement speed by 2 for 30 seconds
        - Magnet - collects all dropped coins & resources
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

- Stats Screen Improvements
    - Display list of affected stats
        - For each stat, display their respective "child attribute"
            - For each "child attribute", display the affected attribute
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
