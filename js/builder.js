Game.Builder = function(width, height) {
    this._width = width;
    this._height = height;
    this._tiles = this._generateLevel();
};

Game.Builder.prototype.getTiles = function () {
    return this._tiles;
};
Game.Builder.prototype.getWidth = function () {
    return this._width;
};
Game.Builder.prototype.getHeight = function () {
    return this._height;
};

Game.Builder.prototype._generateLevel = function() {
    var map = new Array2d(this._width, this._height)
    var generator = new ROT.Map.Digger(this._width, this._height, {corridorLength: [0, 0]});
    var setMapTile = function (x, y, value) {
         if (value === 1) {
            map.set(x, y, Game.Tile.wallTile);
        } else {
            map.set(x, y, Game.Tile.floorTile);
        }       
    }
    generator.create(setMapTile)
    return map;
};