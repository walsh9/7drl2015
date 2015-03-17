Game.Tile = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    this._walkable = properties['walkable'] || false;
    this._enemyWalkable = (properties['enemyWalkable'] !== undefined) ? 
        properties['enemyWalkable'] : this._walkable ;
    this._blocksLight = (properties['blocksLight'] !== undefined) ? 
        properties['blocksLight'] : true;
    this._description = properties['description'] || '';
    this._action = properties['action'] || undefined;
    this._bumpable = (properties['action'] != undefined);
    this._nextTile = properties['nextTile'] || undefined;
};
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};
Game.Tile.prototype.isEnemyWalkable = function() {
    return this._enemyWalkable;
};
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};
Game.Tile.prototype.isBumpable= function() {
    return this._bumpable;
};
Game.Tile.prototype.getDescription = function() {
    return this._description;
};
Game.Tile.prototype.getAction = function() {
    return this._action;
};
Game.Tile.prototype.hasNext = function() {
    return (this._nextTile !== undefined);
};
Game.Tile.prototype.getNext = function() {
    return Game.Tile[this._nextTile];
};

Game.Tile.nullTile = new Game.Tile({description: '(unknown)'});

Game.Tile.floorTile = new Game.Tile({
    character: '.',
    foreground: '#6c9',
    walkable: true,
    blocksLight: false,
    description: 'A smooth tiled floor'
});

Game.Tile.zotFloorTile = new Game.Tile({
    character: '.',
    foreground: '#c0c',
    walkable: true,
    blocksLight: false,
    description: 'A smooth tiled floor'
});

(function() {
    var snailTrailDuration = 14;
    Game.Tile.snailTrailTile = {};
    for (var i = 0; i < snailTrailDuration; i++) {
        Game.Tile['snailTrailTile' + i] = new Game.Tile({
            character: '~',
            nextTile: ((1 + i) < snailTrailDuration) ? 'snailTrailTile' + (1 + i) : 'floorTile',
            foreground: 'green',
            walkable: true,
            blocksLight: false,
            description: 'Toxic slime',
            action: function(target) {
                // Only toxic to the player :o
                if (target.hasMixin(Game.EntityMixins.PlayerActor)) {
                    var slimeDamage = 1;
                    if (target.hasMixin('buffGetter')) {
                        slimeDamage = Math.max(slimeDamage - target.getBuffTotal('defense'), 0)
                    }
                    Game.sendMessage(target, 'The toxic slime burns you for ' + slimeDamage + ' damage!');
                    target.takeDamage(null, slimeDamage);
                }
            }

        });
    }
})()

Game.Tile.pathTile = new Game.Tile({
    character: '~',
    foreground: 'cyan',
    walkable: true,
    blocksLight: false,
    description: 'A strong current'
});

Game.Tile.wallTile = new Game.Tile({
    character: ' ',
    background: '#6c9',
    description: 'A smooth stone wall'
});

Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: '#6c9',
    walkable: false,
    blocksLight: false,
    description: 'A marble staircase leading upwards',
    action: function() {
        var nextLevel = Game._currentScreen._level + 1;
        Game._currentScreen._level++;
        Game._currentScreen.newLevel(nextLevel);
    }
});

Game.Tile.jewelOfZot = new Game.Tile({
    character: '*',
    foreground: '#f0f',
    walkable: false,
    blocksLight: false,
    description: 'The %c{#f0f}Jewel of Zot',
    action: function() {
        Game.switchScreen(Game.Screen.winScreen);
    }
});

Game.Tile.vortexTile = new Game.Tile({
    character: '&',
    foreground: '#008',
    walkable: true,
    enemyWalkable: false,
    blocksLight: false,
    description: 'A strange vortex'
});

Game.Tile.corpseTile = new Game.Tile({
    character: '%',
    foreground: 'gray',
    walkable: true,
    blocksLight: false,
    description: 'A battered shell'
});

// Helper functions
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};
Game.getHorizontalNeighbors = function(x, y) {
    var tiles = [];
    tiles.push({x: x - 1, y: y});
    tiles.push({x: x + 1, y: y});
    return tiles.randomize();
};
Game.getVerticalNeighbors = function(x, y) {
    var tiles = [];
    tiles.push({x: x, y: y - 1});
    tiles.push({x: x, y: y + 1});
    return tiles.randomize();
};
Game.getCardinalNeighbors = function(x, y) {
    var tiles = [];
    tiles.push({x: x - 1, y: y});
    tiles.push({x: x + 1, y: y});
    tiles.push({x: x, y: y - 1});
    tiles.push({x: x, y: y + 1});
    return tiles.randomize();
};