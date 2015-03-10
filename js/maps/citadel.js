Game.Map.Citadel = function(tiles, player) {
    // Call the Map constructor
    Game.Map.call(this, tiles);
    // Add the player
    this.addEntityAtRandomPosition(player, 0);
    for (var i = 0; i < 15; i++) {
        var entity = Game.EntityRepository.createRandom();
        // Add a random entity
        this.addEntityAtRandomPosition(entity);
    }
};
Game.Map.Citadel.extend(Game.Map);
