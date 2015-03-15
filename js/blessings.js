Game.BlessingRepository = new Game.Repository('blessings', Game.Blessing);

Game.BlessingRepository.define("Coursing Power", {
    name: "Coursing Power",
    description: "A +1 bonus to all damage dealt this level.",
    message: "The water around you dances with energy.",
    target: 'player',
    action: function (player) {
        player.addBuff('attack', 1, -1, 'Coursing Power', true) 
    }
});

Game.BlessingRepository.define("Swell", {
    name: "Swell",
    description: "Heal 3 HP.",    
    message: "Your blood feels warm.",
    action: function(player) {
        player.setHp(Math.min(player.getHp() + 3, player.getMaxHp()));
    }
});

Game.BlessingRepository.define("Maelstrom", {
    name: "Maelstrom",
    description: "Deal 2 damage to all enemies in your line of sight.",    
    message: "The waters twist violently!",
    action: function(player) {
        var map = player.getMap();
        var targets = player.getVisibleTargets();
            console.log(targets);
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var damage = Math.max(2 - target.getDefenseValue() + player.getBuffTotal('attack'), 0);
            Game.sendMessage(player, 'You blast the %s for %s damage!', [target.getName(), damage]);
            target.takeDamage(player, damage);
        }
        player.decrementBuffDuration('attack');
    }
});

Game.BlessingRepository.define("Overflowing", {
    name: "Overflowing",
    description: "Be instantly granted 3 new blessings.",    
    message: "Levi smiles upon you.",
    action: function(player) {
        for (var i = 0; i < 3; i++) {
            if (player.canAddBlessing) {
                var blessing = Game.BlessingDeck.draw();
                player.addBlessing(blessing);
            }
        }
    }
});

Game.BlessingRepository.define("Surging Might", {
    name: "Surging Might",
    description: "Your next attack does +3 damage",    
    message: "The might of heroes surges through your veins.",    
    action: function (player) {
        player.addBuff('attack', 3, 1, 'Surging Might', false, "You feel less mighty.") 
    }
});

Game.BlessingRepository.define("Ebb and Flow", {
    name: "Ebb and Flow",
    description: "Detect enemies on this floor.",    
    message: "You can feel subtle perturbations in the currents.",
    action: function (player) {
        player.addAbility('telepathy');
    }    
});

Game.BlessingRepository.define("Guiding Tide", {
    name: "Guiding Tide",
    description: "The way forward will be revealed.",    
    message: "A strong current is guiding you towards the Jewel of Zot",
    action: function(player) {
        var map = player.getMap();
        var stairs = map.findTile('<')[0];
        var passableCallback = function(x, y) {
            return (map.getTile(x,y).isWalkable() || map.getTile(x,y) == Game.Tile.stairsUpTile);
        };
        map.getTile(stairs.x, stairs.y)
        var p = {x: player.getX(), y: player.getY()}
        var astar = new ROT.Path.AStar(p.x, p.y, passableCallback, {topology: 4});
        astar.compute(stairs.x, stairs.y, function(x, y) {
            if (map.getTile(x, y).isEnemyWalkable()) {
               map.setTile(x, y, Game.Tile.pathTile);
            }
        });
    }
});

Game.BlessingRepository.define("Bubble Shield", {
    name: "Bubble Shield",
    description: "Block the next 3 attacks.",    
    message: "You are enveloped by a bubble.",
    action: function(player) {
        player.setChar('O');
        player.addBuff('defense', 10, 3, 'Bubble Shield', false, "Your bubble pops!") 
    }
});
                                
Game.BlessingRepository.define("Flow Into Time", {
    name: "Flow Into Time",
    description: "Take 5 free turns.",    
    message: "A swift current guides your movements.",
    action: function(player) {
        player.addAbility('speed')
        player.addBuff('speed', 1, 5, "Flow Into Time", false, "Your speed returns to normal.");   //not done     
    }
});

Game.BlessingRepository.define("Thirst", {
    name: "Thirst",
    description: "Gain 1 HP for each enemy defeated this level.",    
    message: "",
    action: function(player) {
        player.addAbility('healOnKill');
    }
});

Game.BlessingRepository.define("Vortex Ward", {
    name: "Vortex Ward",
    description: "Create a 3 x 3 vortex around you that enemies cannot pass.",    
    message: "The waters around you swirl in arcane patterns.",
    action: function(player) {
        var x = player.getX();
        var y = player.getY();
        var tiles = Game.getNeighborPositions(x, y)
        tiles.push({x: x, y: y});
        for (var i = 0; i <  tiles.length; i++) {
            var tile = tiles[i];
            if (player.getMap().getTile(tile.x, tile.y).isWalkable()) { 
                player.getMap().setTile(tile.x, tile.y, Game.Tile.vortexTile);
            }
        };       
    }
});

Game.BlessingRepository.define("Storm Shield", {
    name: "Storm Shield",
    description: "Everytime you are attacked this level, counterattack for 1 damage.",    
    message: "You hear thunder.",
    action: function(player) {
        player.addAbility('zapOnHit');
    }
});

Game.BlessingDeck = new Game.Deck("blessings");

Game.BlessingDeck.add(Game.BlessingRepository.create("Bubble Shield"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Bubble Shield"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Bubble Shield"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Surging Might"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Surging Might"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Surging Might"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Swell"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Swell"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Swell"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Vortex Ward"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Vortex Ward"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Vortex Ward"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Flow Into Time"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Flow Into Time"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Flow Into Time"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Maelstrom"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Maelstrom"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Coursing Power"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Coursing Power"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Ebb and Flow"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Ebb and Flow"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Guiding Tide"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Guiding Tide"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Thirst"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Thirst"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Overflowing"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Overflowing"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Storm Shield"));
Game.BlessingDeck.add(Game.BlessingRepository.create("Storm Shield"));
Game.BlessingDeck.shuffle()
