## Changelog

### WIP

- log improvements
    - partial bold in log entries
    - partial color change in log entry (for example "inflicted **red**->50 damage")
- Fix issues with regeneration - Property cleaning intervals which were causing issues
- Fix arrow logic - currently there is a bug when multiple arrows are shot, the enemy is already defeated but after the
  arrow arrives at destination, XP is awarded again
- Fix portal logic - can somehow use portal multiple times by spamming enter key
- Added easy mode in settings
- Added rapid level up mode in settings
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


### v0.0.7

- add FPS counter
- make UI elements modular
    - fps counter
    - dps counter
    - log
- Log Improvements
    - Added ability to "close" & "open" the log
    - Separate logic for storing log entries and rendering them

### v0.0.6

- Displaying number of unallocated stat points without opening stats page
- Added Ability to allocate stat points in bulk
    - Holding "Shift" will enter "Bulk" mode and allocate 10 stat points at once
- Added Ability to select stats with keyboard (e.g. 1,2,3,4)
- Fixed Bug - damage was not applied immediately after allocating stat
- Renamed levels to stages
- Log improvements - formatting numbers in logs (showing 1.5m instead of 15125555)

### v0.0.5

- Added DPS Counter
- Implemented remaining stats / attributes:
    - Dexterity stat increases "Evade Chance" amount
    - Fortitude stat increases "Armor Rating amount
- Improvements on Logs
    - Changed font
    - Changed text size
- Allow movement by "ASDW" keys

### V0.0.4

- Added "Critical Hit" Logic
    - Perception stat increases "Critical Chance" amount
    - Perception stat increases "Critical Damage" amount
- Added Log functionality, which displays messages, when:
    - Hero attacked enemy
    - Hero received damage
    - Hero regenerated health
    - Hero gained xp

### V0.0.3

- Added HP Regen Logic
- Added Floating Numbers
    - When damage is inflicted
    - When damage isr received
    - XP is gained
    - Health is replenished

### V0.0.2

- Added Player Stats
    - On level up player gains a stat point, which they can choose between different stats:
        - Finesse
        - Awareness
        - Resilience
        - Thoughtfulness
    - Ability top open "Stats" UI in-game by clicking "C"

### V0.0.1

- UI Improvements
    - On pause screen, resume game on "Esc" press
    - Display the current player level in game UI
    - Show HP / Max HP with Numbers
