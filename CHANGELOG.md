## Changelog

### v0.0.11

- Improvements on boosts
  - Displaying active boosts
  - Fixed crushing bug on powerups
  - Now can drop all powerups except for default ones
  - When game is paused, the timed powerups would be paused as well
- Stats Screen Improvements
  - Displaying Pick-able stats in a better UI
  - Displaying all affected attributes

### v0.0.10

- Showing log entries and floating texts when collecting resources
- Showing collected resource amounts with formatted numbers
- Blue circle (collect distance) only visible when "Debug Mode" is enabled
- Improvements on Loot Drops
  - Drop pull acceleration - instead of constant pull speed, it shall start slow and accelerate
  - "Throwing around" the loot drops for more aesthetic looks
  - Drop multiple coins / souls for fancy effect
- If debug mode is enabled - Press "M" for magnet effect when in debug mode
- Enemies now may drop the following powerups
  - Magnet - collects all dropped coins & resources
  - Double damage - provide double damage for 30 seconds
  - Fast speed - increases hero's attack speed by 2 and hero's movement speed by 1.5 for 30 seconds
  - Invulnerability - hero becomes invulnerable for 30 seconds

### v0.0.9

- Added Stage Info - Showing which stage are You on, how many enemies are alive / total
- Ability to un-allocate points - Hold "Alt" button to un-allocate stat points
- Implemented "Loot" functionality - each enemy now has a chance of dropping resources (souls & coins)
  - At this points, the resources are not usable in any way
  - "Thoughtfulness" stat affects how many resources enemies will drop, and how frequently they drop

### v0.0.8

- Log improvements - added ability to display parts of log entries in extended styling
- Fixed issues with HP Regeneration, which was causing errors in console
- Fixed issue with arrows - when multiple arrows are shot, and enemy is defeated but XP is awarded multiple times
- Added "Easy Mode" in settings - each stat is 10 times more effective
- Added "Rapid Level-Up" mode in settings - gain 100 times more XP
- Attack speed and armor rating revamp

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
