Game.Map.Citadel = function(tiles, player, level) {
    // Call the Map constructor
    Game.Map.call(this, tiles);
    // Add the player
    this.addEntityAtRandomPosition(player, 0);
    for (var i = 0; i < 15; i++) {
        var entity = Game.EntityRepository.createRandom();
        // Add a random entity
        this.addEntityAtRandomPosition(entity);
    }
    if (level < 7) {
        var stairPosition = this.getRandomFloorPosition();
        this._tiles.set(stairPosition.x, stairPosition.y,  Game.Tile.stairsUpTile);
    } else {
        var jewelPosition = this.getRandomFloorPosition();
        this._tiles.set(jewelPosition.x, jewelPosition.y,  Game.Tile.jewelOfZot);        
    }
};
Game.Map.Citadel.extend(Game.Map);
