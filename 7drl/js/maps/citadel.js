Game.Map.Citadel = function(tiles, player, level) {
    // Call the Map constructor
    Game.Map.call(this, tiles);
    // Add the player
    //this.addEntityAtRandomPosition(player, 0);
    for (var i = 0; i < 15; i++) {
        var entity = Game.EntityRepository.createRandom();
        // Add a random entity
        this.addEntityAtRandomPosition(entity);
    }
    if (level < 7) {
        if (level % 2 !== 0) {
            // Odd levels
            var stairPosition = this.getXBoundClearFloorPosition(40, 60);
            var playerPosition = this.getXBoundClearFloorPosition(0, 15);            
        } else {
            // Even levels
            var stairPosition = this.getXBoundClearFloorPosition(0, 20);
            var playerPosition = this.getXBoundClearFloorPosition(45, 60);            
        }
        this._tiles.set(stairPosition.x, stairPosition.y,  Game.Tile.stairsUpTile);
        player.setX(playerPosition.x);
        player.setY(playerPosition.y);
        this.addEntity(player);
    } else {
        var jewelPosition = this.getXBoundClearFloorPosition(40, 60);
        var playerPosition = this.getXBoundClearFloorPosition(0, 15);            
        this._tiles.set(jewelPosition.x, jewelPosition.y,  Game.Tile.jewelOfZot);
        var pedestalTiles = Game.getNeighborPositions(jewelPosition.x, jewelPosition.y);
        for (i = 0; i < pedestalTiles.length; i++) {
            var pedestalTile = pedestalTiles[i];
            this._tiles.set(pedestalTile.x, pedestalTile.y, Game.Tile.zotFloorTile);
        };
        player.setX(playerPosition.x);
        player.setY(playerPosition.y);
        this.addEntity(player);
    }
};
Game.Map.Citadel.extend(Game.Map);
