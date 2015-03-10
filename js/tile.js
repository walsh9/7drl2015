Game.Tile = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    this._walkable = properties['walkable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ? 
        properties['blocksLight'] : true;
    this._description = properties['description'] || '';
};
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};
Game.Tile.prototype.getDescription = function() {
    return this._description;
};

Game.Tile.nullTile = new Game.Tile({description: '(unknown)'});
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'A smooth tiled floor'
});
Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'green',
    description: 'A smooth stone wall'
});

Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'green',
    walkable: true,
    blocksLight: false,
    description: 'A marble staircase leading downwards'
});
Game.Tile.waterTile = new Game.Tile({
    character: '~',
    foreground: 'blue',
    walkable: false,
    blocksLight: false,
    description: 'Sea water'
});

Game.Tile.corpseTile = new Game.Tile({
    character: '%',
    foreground: 'red',
    walkable: true,
    blocksLight: false,
    description: 'A lobsterfolk corpse'
});

// Helper function
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