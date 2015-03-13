Game.BlessingRepository = new Game.Repository('blessings', Game.Blessing);

Game.BlessingRepository.define("Water Sword", {
    name: "Water Sword",
    description: "An enduring +1 bonus to all damage dealt.",
    message: "You are enveloped in a green aura.",
    target: 'player',
    action: function (player) {
        player.addAttackBuff(1, -1, 'Water Sword', true) 
    }
});

Game.BlessingRepository.define("Ocean's Wrath", {
    name: "Ocean's Wrath",
    description: "Deal 1 damage to all enemies in line of sight",    
    message: "Lightning radiates from your feet!",
    action: function(player) {
        var map = player.getMap();
        var targets = player.getVisibleTargets();
            console.log(targets);
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var damage = Math.max(1 - target.getDefenseValue() + player.getAttackBuffTotal(), 0);
            Game.sendMessage(player, 'You blast the %s for %s damage!', [target.getName(), damage]);
            target.takeDamage(player, damage);
        }
    }
});

Game.BlessingRepository.define("Ocean's Bounty", {
    name: "Ocean's Bounty",
    description: "Instantly make 3 new blessings available.",    
    message: "Levi smiles upon you.",
    action: function(player) {
        for (var i = 0; i < 3; i++) {
            if (player.canAddBlessing) {
                var blessing = Game.BlessingRepository.createRandom();
                player.addBlessing(blessing);
            }
        }
    }
});

Game.BlessingRepository.define("Leech", {
    name: "Leech",
    description: "An enduring -1 penalty to all damage dealt. Heal for each damage dealt.",    
    message: "You feel voraciaous.",    
});

Game.BlessingRepository.define("Ebb and Flow", {
    name: "Ebb and Flow",
    description: "Detect enemies on this floor.",    
    message: "You can feel subtle perturbations in the currents.",    
});

Game.BlessingRepository.define("Resolute Tide", {
    name: "Resolute Tide",
    description: "The way forward will be revealed.",    
    message: "Water is flowing towards the Jewel of Zot",
    action: function(player) {
        var map = player.getMap();
        var stairs = map.findTile('<')[0];
        var passableCallback = function(x, y) {
            return (map.getTile(x,y).isWalkable() || map.getTile(x,y) == Game.Tile.stairsUpTile);
        };
        map.getTile(stairs.x, stairs.y)
        console.log(player.getX() +':'+ player.getY() +' -> '+ stairs.x +':'+ stairs.y);
        var p = {x: player.getX(), y: player.getY()}
        var astar = new ROT.Path.AStar(p.x, p.y, passableCallback, {topology: 4});
        astar.compute(stairs.x, stairs.y, function(x, y) {
            console.log(x +':'+ y);
            if (map.getTile(x, y) == Game.Tile.floorTile) {
               map.setTile(x, y, Game.Tile.glowingFloorTile);
            }
        });
        console.log(player);
        console.log(stairs);
    }
});

