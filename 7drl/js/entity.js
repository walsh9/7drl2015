Game.Entity = function(properties) {
    properties = properties || {};
    // Call the dynamic glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);
    // Instantiate any properties from the passed object
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._map = null;
    this._alive = true;
    this._description = properties['description'] || '';
    // Acting speed
    this._speed = properties['speed'] || 1000;
};
// Make entities inherit all the functionality from dynamic glyphs
Game.Entity.extend(Game.DynamicGlyph);

Game.Entity.prototype.setX = function(x) {
    this._x = x;
};
Game.Entity.prototype.setY = function(y) {
    this._y = y;
};
Game.Entity.prototype.setMap = function(map) {
    this._map = map;
};
Game.Entity.prototype.setSpeed = function(speed) {
    this._speed = speed;
};
Game.Entity.prototype.setPosition = function(x, y) {
    var oldX = this._x;
    var oldY = this._y;
    // Update position
    this._x = x;
    this._y = y;
    // If the entity is on a map, notify the map that the entity has moved.
    if (this._map) {
        this._map.updateEntityPosition(this, oldX, oldY);
    }
};
Game.Entity.prototype.getX = function() {
    return this._x;
};
Game.Entity.prototype.getY   = function() {
    return this._y;
};
Game.Entity.prototype.getMap = function() {
    return this._map;
};
Game.Entity.prototype.getDescription = function() {
    return this._description;
};

Game.Entity.prototype.getSpeed = function() {
    return this._speed;
};

Game.Entity.prototype.tryMove = function(x, y, map) {
    var map = this.getMap();
    var tile = map.getTile(x, y);
    var target = map.getEntityAt(x, y);

    // If an entity was present at the tile
    if (target && target !== this) {
        // An entity can only attack if the entity has the Attacker mixin and 
        // either the entity or the target is the player.
        if (this.hasMixin('Attacker') && 
            (this.hasMixin(Game.EntityMixins.PlayerActor) ||
             target.hasMixin(Game.EntityMixins.PlayerActor))) {
            this.attack(target);
            return true;
        } 
        // If not nothing we can do, but we can't 
        // move to the tile
        return false;        
    // Check if we can walk on the tile
    // and if so simply walk onto it
    } else if ( this.hasMixin(Game.EntityMixins.PlayerActor) && (tile.isWalkable() ) ||
                tile.isEnemyWalkable()) {        
        // Update the entity's position
        this.setPosition(x, y);
        var action = tile.getAction();
        if (action) {
            action.call(null, this);
        };
        return true;
    } else if ( this.hasMixin(Game.EntityMixins.PlayerActor) && tile.isBumpable() ) {
        var action = tile.getAction();
        if (action) {
            action.call(null, this);
        }
    }
    return false;
};
Game.Entity.prototype.isAlive = function() {
    return this._alive;
};
Game.Entity.prototype.kill = function(message) {
    // Only kill once!
    if (!this._alive) {
        return;
    }
    this._alive = false;
    if (message) {
        Game.sendMessage(this, message);
    } else {
        Game.sendMessage(this, "You have died!");
    }

    // Check if the player died, and if so call their act method to prompt the user.
    if (this.hasMixin(Game.EntityMixins.PlayerActor)) {
        this.act();
    } else {
        this.getMap().removeEntity(this);
    }
};
Game.Entity.prototype.switchMap = function(newMap) {
    // If it's the same map, nothing to do!
    if (newMap === this.getMap()) {
        return;
    }
    this.getMap().removeEntity(this);
    // Clear the position
    this._x = 0;
    this._y = 0;
    // Add to the new map
    newMap.addEntity(this);
};