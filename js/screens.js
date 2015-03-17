Game.Screen = {};

// Define our initial start screen
Game.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        var y = 0;
        display.drawText(1, y++, "The seaside city of Port Yendor has prospered for as long as you can");
        display.drawText(1, y++, "remember, thanks to the powerful %c{#f0f}Jewel of Zot%c{#ccc}.");
        y++;
        display.drawText(1, y++, "But now the %c{red}lobsterfolk%c{#ccc} have stolen the jewel and are using it");
        display.drawText(1, y++, "for dark purposes!");
        y++;
        display.drawText(1, y++, "With the help of Levi, god of tides and currents, you must infiltrate");
        display.drawText(1, y++, "the %c{#6c9}Sunken Citadel%c{#ccc} and retrieve it from the 7th floor!");
        y++;
        y++;
        y = display.getOptions().height - 2;
        display.drawText(1, y++, "%c{yellow}Press any key to start!");
    },
    handleInput: function(inputType, inputData) {
        Game.switchScreen(Game.Screen.playScreen);
    }
};

// Define our playing screen
Game.Screen.playScreen = {
    _player: null,
    _level: 1,
    _gameEnded: false,
    _subScreen: null,
    _ignoredOne: false,
    enter: function() {
        this._player = new Game.Entity(Game.PlayerTemplate);
        this.newLevel(this._level);
    },
    initGame: function() {

    },
    everyTurn: function() {
        if (this._player.getBuffTotal('speed') === 0) {
            this.ageTiles();
        }        
    },
    exit: function() { console.log("Exited play screen."); },
    newLevel: function(level) {
        this._player.setFavor(3);
        this._player.setHp(this._player.getMaxHp());
        this._player.removeAbility('telepathy');
        this._player.removeAbility('zapOnHit');
        this._player.removeAbility('healOnKill');
        this._player.removeBuffByName('Coursing Power');
        var newFavors = (level === 1) ? 4 : 3;
        for (var i = 0; i < newFavors; i++) {
            if (this._player.canAddBlessing) {
                var blessing = Game.BlessingDeck.draw();
                this._player.addBlessing(blessing);
            }
        }
        // Create a map based on our size parameters
        var width = 60;
        var height = 24;
        // Create our map from the tiles and player
        var tiles = new Game.Builder(width, height).getTiles();
        var map = new Game.Map.Citadel(tiles, this._player, level);
        // Start the map's engine
        map.getEngine().start();
        if (level !== 1) {
            Game.sendMessage(this._player, "Levi heals your wounds and offers you new blessings.")
        }
    },
    render: function(display) {
        // Render subscreen if there is one
        if (this._subScreen) {
            this._subScreen.render(display);
            return;
        }

        // Render the tiles
        this.renderTiles(display);
        // Get the messages in the player's queue and render them
        this.renderMessages(display);
        // Render player stats
        this.renderStatus(display);
    },
    renderMessages: function(display) {
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += display.drawText(
                0, 
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }    
    },
    ageTiles: function() {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        var map = this._player.getMap();
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                var tile = map.getTile(x, y);
                if (tile.hasNext()) {
                    map.setTile(x, y, tile.getNext());
                }
            }
        }      
    },
    renderStatus: function(display) {
        var player = this._player
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var blessings = player.getBlessings();

        var headColors = '%c{#6c9}%b{black}';
        var statColors = '%c{white}%b{black}';
        var healthColors = '%c{red}%b{black}';
        var favorColors = '%c{yellow}%b{black}';
        var grayColors = '%c{gray}%b{black}';
        var drawStatus = function (y, text) {
            display.drawText(screenWidth + 1, y, text);
        }

        var locationLine = headColors + 'Sunken Citadel'
        var levelLine = statColors + 'Level: ' + this._level;
        var hpLine = statColors + 'HP: ' +
            healthColors + Array(player.getHp() + 1).join('+') +
            grayColors + Array(player.getMaxHp() - player.getHp() + 1).join('-');
        var favorLine = statColors + 'Favor: ' + favorColors + Array(player.getFavor() + 1).join('* ');
        var attackColor = player.getBuffTotal('attack') > 0 ? '%c{#0cf}' : '';
        var attackLine = statColors + 'Attack: ' + attackColor + player.getAttackValue();

        s++;
        var blessingsHeader = headColors + '[B]lessings';
        var enemyHeader = headColors + '[E]nemies';
        var s = 0;
        drawStatus(s++, locationLine);
        drawStatus(s++, levelLine);
        drawStatus(s++, hpLine);
        drawStatus(s++, favorLine);
        drawStatus(s++, attackLine);

        s++;
        drawStatus(s++, blessingsHeader);
        for (var i = 0; i < player.getBlessingSlotCount(); i++) {
            var blessingStatus = statColors + '[' + (i + 1) + '] ';
            if (i < blessings.length) {
                blessingStatus += blessings[i].name
            }
            drawStatus(s++, blessingStatus);
        }

        s++;
        drawStatus(s++, enemyHeader);
        var enemies = this._player.getVisibleTargets();
        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            drawStatus(s++, '%c{' + enemy.getForeground() + '}' + enemy.getChar() + ' ' + statColors + enemy.getName());
            drawStatus(s++, statColors + 'HP: ' + 
                healthColors + Array(enemy.getHp() + 1).join('+') +
                grayColors + Array(enemy.getMaxHp() - enemy.getHp() + 1).join('-'));
        }



    },
    getScreenOffsets: function() {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() -
            Game.getScreenWidth());
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight());
        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        var map = this._player.getMap();
        // Find all visible cells and update the object
        map.getFov().compute(
            this._player.getX(), this._player.getY(), 
            this._player.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, true);
            });
        // Render the explored map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y) || (this._player.hasAbility('telepathy') && map.getEntityAt(x, y))) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = map.getTile(x, y);
                    var character = glyph.getChar();
                    var foreground = glyph.getForeground();
                    var background = glyph.getBackground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check if we have an entity at the position
                        if (map.getEntityAt(x, y)) {
                            glyph = map.getEntityAt(x, y);
                            character = glyph.getChar();
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else if (this._player.hasAbility('telepathy')) {
                        if (map.getEntityAt(x, y)) {
                            glyph = map.getEntityAt(x, y);
                            character = glyph.getChar();
                        }
                        if (character === ' ') {
                            (background = '#255')
                        } else if (character === '~' || character === '&') {
                            (character = '.')
                        }
                        foreground = '#255';
                    } else {
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        if (character === ' ') {
                            (background = '#255')
                        } else if (character === '~' || character === '&') {
                            (character = '.')
                        }
                        foreground = '#255';
                    }
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        character, 
                        foreground, 
                        background);
                }
            }
        }
    },
    handleInput: function(inputType, inputData) {
        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (this._ignoredOne) {
                Game.switchScreen(Game.Screen.loseScreen);
            } else {
                this._ignoredOne = true;
            }
            return;
        }
        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }
        if (inputType === 'swipeleft') {
            this.move(-1, 0);
            this.everyTurn();
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'swiperight') {
            this.move(1, 0);
            this.everyTurn();
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'swipeup') {
            this.move(0, -1);
            this.everyTurn();
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'swipedown') {
            this.move(0, 1);
            this.everyTurn();
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keydown') {
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT || 
                inputData.keyCode === ROT.VK_H ||
                inputData.keyCode === ROT.VK_NUMPAD4 ||
                inputData.keyCode === ROT.VK_A) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT || 
                       inputData.keyCode === ROT.VK_L ||
                       inputData.keyCode === ROT.VK_NUMPAD6 ||
                       inputData.keyCode === ROT.VK_D) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_UP || 
                       inputData.keyCode === ROT.VK_K ||
                       inputData.keyCode === ROT.VK_NUMPAD8 ||
                       inputData.keyCode === ROT.VK_W) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_DOWN || 
                       inputData.keyCode === ROT.VK_J ||
                       inputData.keyCode === ROT.VK_NUMPAD2 ||
                       inputData.keyCode === ROT.VK_S) {
                this.move(0, 1, 0);
            } else if (inputData.keyCode === ROT.VK_SPACE || 
                       inputData.keyCode === ROT.VK_PERIOD) {
                this.move(0, 0, 0);
            } else if (inputData.keyCode === ROT.VK_1) {
                this._player.invokeBlessing(1);
            } else if (inputData.keyCode === ROT.VK_2) {
                this._player.invokeBlessing(2);
            } else if (inputData.keyCode === ROT.VK_3) {
                this._player.invokeBlessing(3);
            } else if (inputData.keyCode === ROT.VK_4) {
                this._player.invokeBlessing(4);
            } else if (inputData.keyCode === ROT.VK_5) {
                this._player.invokeBlessing(5);
            } else if (inputData.keyCode === ROT.VK_6) {
                this._player.invokeBlessing(6);
            } else if (inputData.keyCode === ROT.VK_7) {
                this._player.invokeBlessing(7);
            } else if (inputData.keyCode === ROT.VK_8) {
                this._player.invokeBlessing(8);
            } else if (inputData.keyCode === ROT.VK_9) {
                this._player.invokeBlessing(9);
            } else if (inputData.keyCode === ROT.VK_B) {
                Game.Screen.blessingHelpScreen.setup(this._player);
                this.setSubScreen(Game.Screen.blessingHelpScreen);
                return;
            } else if (inputData.keyCode === ROT.VK_E) {
                Game.Screen.enemyHelpScreen.setup(this._player);
                this.setSubScreen(Game.Screen.enemyHelpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this.everyTurn();
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === ';') {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Game.Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Game.Screen.lookScreen);
                return;
            } else if (keyChar === '?') {
                // Setup the look screen.
                Game.Screen.helpScreen.setup();
                this.setSubScreen(Game.Screen.helpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } 
    },
    move: function(dX, dY) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, this._player.getMap());
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;
        // Refresh screen on changing the subscreen
        Game.refresh();
    },
    showItemsSubScreen: function(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Game.sendMessage(this._player, emptyMessage);
            Game.refresh();
        }
    }
};

// Define our winning screen
Game.Screen.winScreen = {
    enter: function() {
        this._ignoredOne = false;
        console.log("Entered win screen."); 
    },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        var y = 1;
        var messageColor = "%c{#ccc}"
        display.drawText(1, y++, messageColor + "You grab the %c{f0f}Jewel of Zot%c{#ccc} and escape to the surface.")
        y++;
        display.drawText(1, y++, messageColor + "Congratulations!")
        y++;
        display.drawText(1, y++, messageColor + "The citizens of Port Yendor can rest easy once again.")
        y = display.getOptions().height - 2;
        text = '[ Press any key to play again ]';
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, '%c{yellow}' +text);
    },
    handleInput: function(inputType, inputData) {
        if (this._ignoredOne) {
            location.reload()
        } else {
            this._ignoredOne = true;
        }
    }
};

// Define our winning screen
Game.Screen.loseScreen = {
    enter: function() { 
        this._ignoredOne = false;
        console.log("Entered lose screen."); 
    },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        var y = 1;
        var messageColor = "%c{#ccc}"
        display.drawText(1, y++, messageColor + "You have fallen in the %c{#6c9}Sunken Citadel%c{#ccc}.")
        y++;
        display.drawText(1, y++, messageColor + "Will another hero take your place?")
        y++;
        display.drawText(1, y++, messageColor + "Or will Port Yendor be consumed by the rising tides when")
        display.drawText(1, y++, messageColor + "the %c{red}lobsterfolk%c{#ccc} master the %c{#f0f}Jewel of Zot%c{#ccc}'s power?")
        y = display.getOptions().height - 2;
        text = '[ Press any key to try again ]';
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, '%c{yellow}' +text);
    },
    handleInput: function(inputType, inputData) {
        if (this._ignoredOne) {
            location.reload()
        } else {
            this._ignoredOne = true;
        }
    }
};

Game.Screen.TargetBasedScreen = function(template) {
    template = template || {};
    // By default, our ok return does nothing and does not consume a turn.
    this._isAcceptableFunction = template['okFunction'] || function(x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
};

Game.Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY) {
    this._player = player;
    // Store original position. Subtract the offset to make life easy so we don't
    // always have to remove it.
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;
    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;
    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    // Cache the FOV
    var visibleCells = {};
    this._player.getMap().getFov().compute(
        this._player.getX(), this._player.getY(), 
        this._player.getSightRadius(), 
        function(x, y, radius, visibility) {
            visibleCells[x + "," + y] = true;
        });
    this._visibleCells = visibleCells;
};

Game.Screen.TargetBasedScreen.prototype.render = function(display) {
    Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);

    // Draw a line from the start to the cursor.
    var points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
        this._cursorY);

    // Render stars along the line.
    for (var i = 0, l = points.length; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{#off}o');
        if (i === points.length - 1) {
            display.drawText(points[i].x, points[i].y, '%c{#off}O');            
        }
    }

    // Render the caption at the bottom.
    display.drawText(0, Game.getScreenHeight() - 1, 
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Game.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
    // Move the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_LEFT || 
            inputData.keyCode === ROT.VK_H ||
            inputData.keyCode === ROT.VK_NUMPAD4 ||
            inputData.keyCode === ROT.VK_A) {
            this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT || 
                   inputData.keyCode === ROT.VK_L ||
                   inputData.keyCode === ROT.VK_NUMPAD6 ||
                   inputData.keyCode === ROT.VK_D) {
            this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP || 
                   inputData.keyCode === ROT.VK_K ||
                   inputData.keyCode === ROT.VK_NUMPAD8 ||
                   inputData.keyCode === ROT.VK_W) {
            this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN || 
                   inputData.keyCode === ROT.VK_J ||
                   inputData.keyCode === ROT.VK_NUMPAD2 ||
                   inputData.keyCode === ROT.VK_S) {
            this.moveCursor(0, 1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            Game.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
        }
    }
    Game.refresh();
};

Game.Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
    // Make sure we stay within bounds.
    this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
    // We have to save the last line for the caption.
    this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
};

Game.Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
        this._player.getMap().getEngine().unlock();
    }
};

Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y)) {
                    var entity = map.getEntityAt(x, y);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y).getRepresentation(),
                map.getTile(x, y).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Game.Tile.nullTile.getRepresentation(),
                Game.Tile.nullTile.getDescription());
        }
    }
});

Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                // Check if there's an entity
                if (map.getEntityAt(x, y)) {
                    var entity = map.getEntityAt(x, y);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y).getRepresentation(),
                map.getTile(x, y).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Game.Tile.nullTile.getRepresentation(),
                Game.Tile.nullTile.getDescription());
        }
    }
});

// Define our help screen
Game.Screen.helpScreen = {
    setup: function() {
        // Must be called before rendering.
        this._ignoredOne = false; 
    },
    render: function(display) {
        var text = 'Help';
        var border = '----';
        var y = 0;
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, text);
        display.drawText((Game.getScreenWidth() + 20) / 2 - border.length / 2, y++, border);
        display.drawText(1, y++, 'Retrieve the %c{#f0f}Jewel of Zot%c{#ccc} from the %c{red}lobsterfolks\'%c{#ccc} %c{#6c9}Sunken Citadel!%c{#ccc}');
        y ++;
        display.drawText(1, y++, 'Controls:');
        display.drawText(1, y++, 'Arrow keys, hjkl, or wasd to move.');
        display.drawText(1, y++, '[Space] or [.] to wait.');
        display.drawText(1, y++, '[1 - 9] to invoke your god\'s blessings');
        display.drawText(1, y++, '[;] to look around you');
        display.drawText(1, y++, '[b] to show descriptions of blessings');
        display.drawText(1, y++, '[e] to show descriptions of enemies');
        display.drawText(1, y++, '[?] to show this help screen');
        y ++;
        display.drawText(1, y++, 'Hints:');
        display.drawText(1, y++, '1. Find the upstairs (%c{6c9}<%c{#ccc}) on each floor.');
        display.drawText(1, y++, '2. You don\'t need to kill every enemy.');
        display.drawText(1, y++, '3. Find the %c{f0f}Orb of Zot%c{#ccc} (%c{f0f}*%c{#ccc}) on Level 7 to win.');
        display.drawText(1, y++, '4. Each Blessing costs 1 favor to invoke.');
        display.drawText(1, y++, '5. Blessings are powerful, but you can only use 3 per level. Choose wisely.');
        display.drawText(1, y++, '6. Levi favors those who progress. Health and favor are restored each Level.');
        display.drawText(1, y++, '7. New blessings become available each level.');
        y = display.getOptions().height - 2;
        text = '[ Press any key to continue ]';
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, '%c{yellow}' + text);
   },
    handleInput: function(inputType, inputData) {
        if (this._ignoredOne) {
            Game.Screen.playScreen.setSubScreen(null);
        } else {
            this._ignoredOne = true;
        }
    }
};

// Define our blessing help screen
Game.Screen.blessingHelpScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._ignoredOne = false; 
    },
    render: function(display) {
        var text = 'Available Blessings';
        var border = '-------------------';
        var y = 0;
        var blessingColors = '%c{yellow}';
        var descriptionColors = '%c{white}';
        var blessings = this._entity.getBlessings();
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, text);
        display.drawText((Game.getScreenWidth() + 20) / 2 - border.length / 2, y++, border);
        y += 1;
        for (var i = 0; i < blessings.length; i++) {
            var blessing = blessings[i];
            display.drawText(1, y++, descriptionColors + (1 + i) + '. ' + blessingColors + blessing.name)
            display.drawText(5, y++, descriptionColors + blessing.description)
        }
        y = display.getOptions().height - 2;
        text = '[ Press any key to continue ]';
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, '%c{yellow}' + text);
    },
    handleInput: function(inputType, inputData) {
        if (this._ignoredOne) {
            Game.Screen.playScreen.setSubScreen(null);
        } else {
            this._ignoredOne = true;
        }
    }
};

// Define our enemy help screen
Game.Screen.enemyHelpScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._ignoredOne = false; 
    },
    render: function(display) {
        var text = 'Nearby Enemies';
        var border = '--------------';
        var y = 0;
        var enemyColors = '%c{yellow}';
        var descriptionColors = '%c{white}';
        var enemies = this._entity.getVisibleTargets();
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, text);
        display.drawText((Game.getScreenWidth() + 20) / 2 - border.length / 2, y++, border);
        y += 1;
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            display.drawText(1, y++, '%c{' + enemy.getForeground() + '}' + enemy.getChar() + enemyColors + ' - ' + enemy.getName())
            display.drawText(5, y++, descriptionColors + enemy.getDescription())
        }
        y = display.getOptions().height - 2;
        text = '[ Press any key to continue ]';
        display.drawText((Game.getScreenWidth() + 20) / 2 - text.length / 2, y++, '%c{yellow}' + text);
    },
    handleInput: function(inputType, inputData) {
        if (this._ignoredOne) {
            Game.Screen.playScreen.setSubScreen(null);
        } else {
            this._ignoredOne = true;
        }
    }
};