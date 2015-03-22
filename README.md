#Chitinous Crooks
![screenshot](https://cloud.githubusercontent.com/assets/6074785/6702506/e2a406bc-cd02-11e4-93e7-ff5826d0a826.png)

## Play now
http://walsh9.github.io/7drl2015/

## Intro
**Chitinous Crooks** is a roguelike game made in seven days for the 2015 [7DRL Challenge](http://www.roguebasin.com/index.php?title=Seven_Day_Roguelike_Challenge). It's a very traditional roguelike in both gameplay and aesthetics. But you have no experience levels or items to help you, just a random set of god-granted abilities. Each dungeon level, you can use up to three of these, and every time you pass a level your health is restored and you gain additional abilities to choose from.

Special thanks goes to [rot.js](http://ondras.github.io/rot.js/hp/) and the [tutorial at the Coding Cookies blog](http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/).

## Controls
* Arrow keys, hjkl, or wasd to move.
* [Space] or [.] to wait.
* [1 - 9] to invoke your god\'s blessings
* [;] to look around you
* [b] to show descriptions of blessings
* [e] to show descriptions of enemies
* [?] to show help screen

## Hints
1. Find the upstairs `<` on each floor.
2. You don't need to kill every enemy.
3. Find the Jewel of Zot `*` on Level 7 to 
4. Each Blessing costs 1 favor to invoke.
5. Blessings are powerful, but you can only use 3 per level. Choose wisely.
6. Levi favors those who progress. Health and favor are restored each level.
7. New blessings become available each level.


## 7DRL Challenge History

* **Saturday:** Suddenly realize it is the week of the 7drl challenge.
* **Sunday:** Never made a game before. No detailed plans. Decide to try anyway. Start coding at around 11:30 pm...
* **Monday (Day 1):** Have been working on another js project recently so I feel like I have momentum. I'll use RoT.js.
* Use the tutorial at Coding Cookies to get a foundation. Strip out stuff I don't need like inventory and experience.
* Start on gameplay idea based loosely on card games. You randomly draw a hand of cards (prayers, spells).  You can only 'play' so many per turn/level/whatever. Not straying too far for basic roguelike gameplay as I'm expecting a lot of effort just to make a game that works.
* Got an @ in a dungeon.
* **Tuesday:** I need a theme. Anything but goblins. I dunno, lobsterfolk? Sure. Sounds good.  Ooh, and they can have an Atlantissy dungeon. And the player's god and abilities can be sea themed.  Okay, this works.
* Add a few lobsterfolk enemies and start working on abilities system.
* **Wednesday:** Didn't have a lot of time today. Implement a few abilities.
* **Thursday:** Implement more abilities.
* **Friday:** Didn't get a chance to work on the game.
* **Saturday:** Add crabfolk and snails.
* Add win and lose screens.
* **Sunday (Day 7):** Final abilities. 
* Testing. 
* Bug fixing. 
* Add touchscreen controls. 
* Game finished around 10:40 pm.

## POST 7DRL Changelog
### 1.1
* Add link to original 7DRL version.
* Buff healing from 'Swell' to 4HP.
* Increase size of 'Vortex Ward' and make it push away directly adjacent enemies.
* Increase 'Flow Into Time' duration to 8 turns, but make player attacks do 0 damage while it's active.
* Remove 'Overflowing'.
* Add a message when you enter a new floor that informs player that they are healed and have new blessings.
* Make the text 'Jewel of Zot' consistently magenta.
* Clean up the 'look' screen.
* Add a note to indicate that you can move by swiping on touchscreens.
* Responsive canvas sizing for small screens.
* Change swipe action to only work on game canvas.
* Other touch improvements.
* Prevent unwanted scrolling from arrow keys, spacebar, etc.
* A few other UI tweaks.

### 1.1.1
* Touch buttons shouldn't fire twice on Dolphin browser anymore.
* Game window scales wider on small screens now.
