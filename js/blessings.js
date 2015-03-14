Game.BlessingRepository = new Game.Repository('blessings', Game.Blessing);

Game.BlessingRepository.define("Water Sword", {
    name: "Water Sword",
    description: "An enduring +1 bonus to all damage dealt.",
    message: "You are enveloped in a green aura.",
    target: 'player',
    action: function (player) {
        player.addBuff('attack', 1, -1, 'Water Sword', true, "Your aura vanishes!") 
    }
});

Game.BlessingRepository.define("Dolphin Tears", {
    name: "Dolphin Tears",
    description: "Heal 3 HP",    
    message: "You feel warm.",
    action: function(player) {
        player.setHp(Math.min(player.getHp() + 3, player.getMaxHp()));
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
            var damage = Math.max(1 - target.getDefenseValue() + player.getBuffTotal('attack'), 0);
            Game.sendMessage(player, 'You blast the %s for %s damage!', [target.getName(), damage]);
            target.takeDamage(player, damage);
        }
        player.decrementBuffDuration('attack');
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

Game.BlessingRepository.define("Strike", {
    name: "Strike",
    description: "Your next attack does +3 damage",    
    message: "Your hair stands on end.",    
    action: function (player) {
        player.addBuff('attack', 3, 1, 'Strike', false, "You no longer feel strong.") 
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
        console.log(player.getX() +':'+ player.getY() +' -> '+ stairs.x +':'+ stairs.y);
        var p = {x: player.getX(), y: player.getY()}
        var astar = new ROT.Path.AStar(p.x, p.y, passableCallback, {topology: 4});
        astar.compute(stairs.x, stairs.y, function(x, y) {
            console.log(x +':'+ y);
            if (map.getTile(x, y) == Game.Tile.floorTile) {
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
        player.addBuff('defense', 10, 3, 'Bubble shield', false, "Your bubble pops!") 
    }
});

Game.BlessingRepository.define("Swift Step", {
    name: "Swift Step",
    description: "Gain 5 free turns",    
    message: "",
    action: function(player) {
        player.setSpeed(5000);   //not done     
    }
});

Game.BlessingRepository.define("Bloodlust", {
    name: "Bloodlust",
    description: "Gain 1 HP for each enemy defeated.",    
    message: "",
    action: function(player) {
        player.addAbility('healOnKill');
    }
});

Game.BlessingRepository.define("Banish", {
    name: "Banish",
    description: "Banish the nearest enemy.",    
    message: "",
    action: function(player) {
    
    }
});

Game.BlessingRepository.define("Storm Shield", {
    name: "Storm Shield",
    description: "Does 1 damage to attacker, when you are attacked.",    
    message: "",
    action: function(player) {
        player.addAbility('zapOnHit');
    }
});

Game.BlessingRepository.define("Flow of Time", {
    name: "Flow of Time",
    description: "Return to the beginning of the level.",    
    message: "",
    action: function(player) {

    }
});


