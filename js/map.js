Game.Map = function(tilesArray) {
    this._tiles = tilesArray;
    this._width = tilesArray.width;
    this._height = tilesArray.height;
    this._fov = [];
    this.setupFov();
    this._entities = {};
    this._scheduler = new ROT.Scheduler.Speed();
    this._engine = new ROT.Engine(this._scheduler);
    this._explored = new Array2d(this._width, this._height).fill(false);
};

//Getters
Game.Map.prototype.getWidth = function() {
    return this._width;
};
Game.Map.prototype.getHeight = function() {
    return this._height;
};

Game.Map.prototype.getTile = function(x, y) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return Game.Tile.nullTile;
    } else {
        return this._tiles.get(x,y) || Game.Tile.nullTile;
    }
};

Game.Map.prototype.setTile = function(x, y, tile) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    this._tiles.set(x, y, tile);
};

Game.Map.prototype.isEmptyFloor = function(x, y) {
    // Check if the tile is floor and also has no entity
    return this.getTile(x, y) == Game.Tile.floorTile &&
           !this.getEntityAt(x, y);
};

Game.Map.prototype.setExplored = function(x, y, state) {
    // Only update if the tile is within bounds
    if (this.getTile(x, y) !== Game.Tile.nullTile) {
        this._explored.set(x, y, state);
    }
};

Game.Map.prototype.isExplored = function(x, y) {
    // Only return the value if within bounds
    if (this.getTile(x, y) !== Game.Tile.nullTile) {
        return this._explored.get(x, y);
    } else {
        return false;
    }
};

Game.Map.prototype.setupFov = function() {
    // Keep this in 'map' variable so that we don't lose it.
    var map = this;
    // Iterate through each depth level, setting up the field of vision

    map._fov = new ROT.FOV.DiscreteShadowcasting(function(x, y) {
            return !map.getTile(x, y).isBlockingLight();
        }, {topology: 4});
};

Game.Map.prototype.getFov = function(depth) {
    return this._fov;
};

Game.Map.prototype.getEngine = function() {
    return this._engine;
};
Game.Map.prototype.getEntities = function() {
    return this._entities;
};
Game.Map.prototype.getEntityAt = function(x, y){
    // Get the entity based on position key 
    return this._entities[x + ',' + y];
};
Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
    results = [];
    // Determine our bounds
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;
    // Iterate through our entities, adding any which are within the bounds
    for (var key in this._entities) {
        var entity = this._entities[key];
        if (entity.getX() >= leftX && entity.getX() <= rightX && 
            entity.getY() >= topY && entity.getY() <= bottomY) {
            results.push(entity);
        }
    }
    return results;
};

Game.Map.prototype.getRandomFloorPosition = function() {
    // Randomly generate a tile which is a floor
    var x, y;
    do {
        x = Math.floor(Math.random() * this._width);
        y = Math.floor(Math.random() * this._height);
    } while(!this.isEmptyFloor(x, y));
    return {x: x, y: y};
};

Game.Map.prototype.addEntityAtRandomPosition = function(entity) {
    var position = this.getRandomFloorPosition();
    entity.setX(position.x);
    entity.setY(position.y);
    this.addEntity(entity);
};

Game.Map.prototype.addEntity = function(entity) {
    // Update the entity's map
    entity.setMap(this);
    // Update the map with the entity's position
    this.updateEntityPosition(entity);
    // Check if this entity is an actor, and if so add
    // them to the scheduler
    if (entity.hasMixin('Actor')) {
       this._scheduler.add(entity, true);
    } 
    // If the entity is the player, set the player.
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
        this._player = entity;
    }
};

Game.Map.prototype.removeEntity = function(entity) {
    // Remove the entity from the map
    var key = entity.getX() + ',' + entity.getY();
    if (this._entities[key] == entity) {
        delete this._entities[key];
    }
    // If the entity is an actor, remove them from the scheduler
    if (entity.hasMixin('Actor')) {
        this._scheduler.remove(entity);
    }
    // If the entity is the player, update the player field.
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
        this._player = undefined;
    }
};


Game.Map.prototype.updateEntityPosition = function(
    entity, oldX, oldY) {
    // Delete the old key if it is the same entity
    // and we have old positions.
    if (typeof oldX === 'number') {
        var oldKey = oldX + ',' + oldY;
        if (this._entities[oldKey] == entity) {
            delete this._entities[oldKey];
        }
    }
    // Make sure the entity's position is within bounds
    if (entity.getX() < 0 || entity.getX() >= this._width ||
        entity.getY() < 0 || entity.getY() >= this._height) {
        throw new Error("Entity's position is out of bounds.");
    }
    // Sanity check to make sure there is no entity at the new position.
    var key = entity.getX() + ',' + entity.getY();
    if (this._entities[key]) {
        throw new Error('Tried to add an entity at an occupied position.');
    }
    // Add the entity to the table of entities
    this._entities[key] = entity;
};

Game.Map.prototype.getPlayer = function() {
    return this._player;
};