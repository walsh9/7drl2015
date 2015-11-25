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
    var options = {
        roomWidth: [5, 8],
        roomHeight: [4, 6],
        corridorLength: [0, 0],
        dugPercentage: 0.5,
    }
    var generator = new ROT.Map.Digger(this._width, this._height, options);
    var setMapTile = function (x, y, value) {
         if (value === 1) {
            map.set(x, y, Game.Tile.wallTile);
        } else {
            map.set(x, y, Game.Tile.floorTile);
        }       
    }

    generator.create(setMapTile);

    var rooms = generator.getRooms();
    var verticalWallIsUnbroken = function (x, y0, y1) {
        for(; y0 <= y1; y0++) {
            if (map.get(x, y0) === Game.Tile.floorTile) {
                return false;
            }
        }
        return true;
    }
    var horizontalWallIsUnbroken = function (x0, x1, y) {
        for(; x0 <= x1; x0++) {
            if (map.get(x0, y) === Game.Tile.floorTile) {
                return false;
            }
        }
        return true;
    }
    for (var i=0; i < rooms.length; i++) {
        var room = rooms[i];
        var left =   room.getLeft();
        var right =  room.getRight();
        var top =    room.getTop();
        var bottom = room.getBottom();
        var midpoint;
        //Top Wall
        if (horizontalWallIsUnbroken(left, right, top - 1)) {
            midpoint = Math.floor((left + right) / 2)
            if (map.get(midpoint, top - 2) === Game.Tile.floorTile) {
                map.set(midpoint, top - 1, Game.Tile.floorTile)
            }
        }
        //Left Wall
        if (verticalWallIsUnbroken(left - 1, top, bottom)) {
            midpoint = Math.floor((top + bottom) / 2)
            if (map.get(left - 2, midpoint) === Game.Tile.floorTile) {
                map.set(left - 1, midpoint, Game.Tile.floorTile)
            }
        }     
    }

    return map;
};