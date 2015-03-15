// Create our Mixins namespace
Game.EntityMixins = {};

// Main player's actor mixin
Game.EntityMixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        this.decrementBuffDuration('speed');
        if (this._acting) {
            return;
        }
        this._acting = true;
        // Detect if the game is over
        if (!this.isAlive()) {
            Game.Screen.playScreen.setGameEnded(true);
            // Send a last message to the player
            Game.sendMessage(this, 'Press [Enter] to continue!');
        }
        // Re-render the screen
        Game.refresh();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();
        // Clear the message queue
        this.clearMessages();
        this._acting = false;
    }
};

Game.EntityMixins.TaskActor = {
    name: 'TaskActor',
    groupName: 'Actor',
    init: function(template) {
        // Load tasks
        this._tasks = template['tasks'] || ['wander']; 
    },
    act: function() {
        var player = Game.Screen.playScreen._player;
        if (player.getBuffTotal('speed') > 0) {
            // skip turn if player has speed buff
        }
        else {
            // Flip crabs in vortices
            if (this.isCrab() &&  this.inVortex()) {
                this.flipCrab();
            }
            // Iterate through all our tasks
            for (var i = 0; i < this._tasks.length; i++) {
                if (this.canDoTask(this._tasks[i])) {
                    // If we can perform the task, execute the function for it.
                    this[this._tasks[i]]();
                    return;
                }
            }
        }
    },
    canDoTask: function(task) {
        if (task === 'hunt' || task === 'huntX' || task === 'huntY' || task === 'slimeHunt') {
            return this.hasMixin('Sight') && this.canSee(this.getMap().getPlayer());
        } else if (task === 'wander' || task === 'wanderX' || task === 'wanderY' || task === 'slime') {
            return true;
        } else {
            throw new Error('Tried to perform undefined task ' + task);
        }
    },
    inVortex: function() {
        return (this.getMap().getTile(this.getX(), this.getY()) === Game.Tile.vortexTile);
    },
    isCrab: function() {
        return (this.getChar() === 'c' || this.getChar() === 'u')
    },
    flipCrab: function() {
        if (this.getChar() === 'c') {
            this.setChar('u');
            this._tasks = ['huntX', 'wanderX'];
        } else if (this.getChar() === 'u') {
            this.setChar('c');
            this._tasks = ['huntY', 'wanderY'];
        }
    },
    canAttack: function(player) {
        var offsets = Math.abs(player.getX() - this.getX()) + 
            Math.abs(player.getY() - this.getY());
        if (offsets === 1) {
            if (this.hasMixin('Attacker') && 
                this.getMap().getTile(this.getX(), this.getY()).isEnemyWalkable()) {
                return true;
            }
        }
        return false;
    },
    hunt: function() {
        var player = this.getMap().getPlayer();
        var self = this;
        // If we are adjacent to the player, then attack instead of hunting.
        if (this.canAttack(player)) {
            this.attack(player);
            return;
        }
        // First try to escape Vortex
        if (this.inVortex()) {
            var walkableTiles = Game.getCardinalNeighbors(this.getX(), this.getY())
                .filter( function(t) { return self.getMap().getTile(t.x, t.y).isEnemyWalkable() });
            if (walkableTiles.length > 0) {
                this.tryMove(walkableTiles[0].x, walkableTiles[0].y);
            }
        } else {
            // Generate the path and move to the first tile.
            var source = this;
            var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
                // If an entity is present at the tile, can't move there.
                var entity = source.getMap().getEntityAt(x, y);
                if (entity && entity !== player && entity !== source) {
                    return false;
                }
                return source.getMap().getTile(x, y).isEnemyWalkable();
            }, {topology: 4});
            // Once we've gotten the path, we want to move to the second cell that is
            // passed in the callback (the first is the entity's strting point)
            var count = 0;
            path.compute(source.getX(), source.getY(), function(x, y) {
                if (count == 1) {
                    source.tryMove(x, y);
                }
                count++;
            });
        }
    },
    huntX: function() {
        var player = this.getMap().getPlayer();
        var self = this;
        // If we are adjacent to the player, then attack instead of hunting.
        if (this.canAttack(player)) {
            this.attack(player);
            return;
        }

        if (this.inVortex()) {
            var walkableTiles = Game.getHorizontalNeighbors(this.getX(), this.getY())
                .filter( function(t) { return self.getMap().getTile(t.x, t.y).isEnemyWalkable() });
            if (walkableTiles.length > 0) {
                this.tryMove(walkableTiles[0].x, walkableTiles[0].y);
            }
        } else {
            // Move left or right
            var offset = player.getX() - this.getX();
            if (offset !== 0) {
                var moveOffset = offset > 0 ? 1 : -1;
                var x = this.getX() + moveOffset;
                var y = this.getY();
                if (!this.getMap().getEntityAt(x, y) && this.getMap().getTile(x, y).isEnemyWalkable()) {
                    this.tryMove(x, y);
                }
            };
        }
    },
    huntY: function() {
        var player = this.getMap().getPlayer();
         var self = this;
       // If we are adjacent to the player, then attack instead of hunting.
        if (this.canAttack(player)) {
            this.attack(player);
            return;
        }
        // First try to escape Vortex
        if (this.inVortex()) {
            var walkableTiles = Game.getVerticalNeighbors(this.getX(), this.getY())
                .filter( function(t) { return self.getMap().getTile(t.x, t.y).isEnemyWalkable() });
            if (walkableTiles.length > 0) {
                this.tryMove(walkableTiles[0].x, walkableTiles[0].y);
            }
        } else {
            // Move up or down
            var offset = player.getY() - this.getY();
            if (offset !== 0) {
                var moveOffset = offset > 0 ? 1 : -1;
                var x = this.getX();
                var y = this.getY() + moveOffset;
                if (!this.getMap().getEntityAt(x, y) && this.getMap().getTile(x, y).isEnemyWalkable()) {
                    this.tryMove(x, y);
                }
            };
        }
    },
    wander: function() {
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        // Flip coin to determine if moving in x direction or y direction
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.getX() + moveOffset, this.getY());
        } else {
            this.tryMove(this.getX(), this.getY() + moveOffset);
        }
    },
    wanderX: function() {
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        this.tryMove(this.getX() + moveOffset, this.getY());
    },
    wanderY: function() {
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        this.tryMove(this.getX(), this.getY() + moveOffset);
    },
    slimeHunt: function() {
        var player = this.getMap().getPlayer();
        var self = this;
        if (!this.inVortex() && this.getMap().getTile(this.getX(), this.getY()) !== Game.Tile.pathTile) {
            this.getMap().setTile(this.getX(), this.getY(), Game.Tile.snailTrailTile0);
        };
        // If we are adjacent to the player, then attack instead of hunting.
        if (this.canAttack(player)) {
            this.attack(player);
            return;
        }
        // First try to escape Vortex
        if (this.inVortex()) {
            var walkableTiles = Game.getVerticalNeighbors(this.getX(), this.getY())
                .filter( function(t) { return self.getMap().getTile(t.x, t.y).isEnemyWalkable() });
            if (walkableTiles.length > 0) {
                this.tryMove(walkableTiles[0].x, walkableTiles[0].y);
            }
        } else {
            // Generate the path and move to the first tile.
            var source = this;
            var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
                // If an entity is present at the tile, can't move there.
                var entity = source.getMap().getEntityAt(x, y);
                if (entity && entity !== player && entity !== source) {
                    return false;
                }
                return (source.getMap().getTile(x, y).isEnemyWalkable());
            }, {topology: 4});
            // Once we've gotten the path, we want to move to the second cell that is
            // passed in the callback (the first is the entity's strting point)
            var count = 0;
            path.compute(source.getX(), source.getY(), function(x, y) {
                if (count == 1) {
                    source.tryMove(x, y);
                }
                count++;
            });    
        }
    },
    slime: function() {
        var x, y, moveOffset;
        if (!this.inVortex() && this.getMap().getTile(this.getX(), this.getY()) !== Game.Tile.pathTile) {
            this.getMap().setTile(this.getX(), this.getY(), Game.Tile.snailTrailTile0);
        };
        for (var i = 0; i < 100; i++) {
            x = this.getX();
            y = this.getY();
            // Flip coin to determine if moving by 1 in the positive or negative direction
            moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
            // Flip coin to determine if moving in x direction or y direction
            if (Math.round(Math.random()) === 1) {
                x += moveOffset;
            } else {
                y += moveOffset;
            }
            if (!this.getMap().getTile(x,y).hasNext()) {
                this.tryMove(x, y);
                return;
            }
        }
    },
};

Game.EntityMixins.BuffGetter = {
    name: 'BuffGetter',
    init: function(template) {
        this._buffs = [];
        this._abilities = [];
    },
    addBuff: function(type, amount, duration, name, isUnique, removeMessage) {
        for (var i=0; i < this._buffs.length; i++) {
            if (this._buffs[i].name === name) {
                if (isUnique) {
                    return false;
                } else {
                    this._buffs[i].duration += duration;
                    return true;
                }
            }
        }
        this._buffs.push({type: type,
                          amount: amount, 
                          duration: duration,  /* # of attacks */  
                          name: name, 
                          isUnique: isUnique, 
                          removeMessage: removeMessage});
        return true;
    },
    getBuffs: function(type){
        return this._buffs.filter(function (buff) {return (buff.type === type)});
    },
    getBuffTotal: function(type) {
        var total = 0;
        var buffs = this.getBuffs(type);
        for (var i = 0; i < buffs.length; i++) {
            total += buffs[i].amount;
        };
        return total;
    },
    decrementBuffDuration: function(type) {
        var i = this._buffs.length; 
        while (i--) {
            if (this._buffs[i].type === type) {
                this._buffs[i].duration -= 1;
                if (this._buffs[i].duration === 0) {
                    //hacky special case
                    if (this._buffs[i].name === "Bubble Shield") {
                        this.setChar('@');
                    }
                    Game.sendMessage(this, this._buffs[i].removeMessage);
                    this._buffs.splice(i, 1);
                };
            }
        };
    },
    removeBuffByName: function(name) {
        for (var i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i].name == name) {
                Game.sendMessage(this, this._buffs[i].removeMessage);
                this._buffs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    getAbilities: function(name) {
        return this._abilities;
    },
    addAbility: function(name) {
        if (!this.hasAbility(name)) {
            this._abilities.push(name);
        }
    },
    removeAbility: function(name) {
        if (this.hasAbility(name)) {
            this._abilities.splice(this._abilities.indexOf(name));
        }
    },
    hasAbility: function(name) {
        return (this._abilities.indexOf(name) > -1);
    },
}

// This signifies our entity can attack basic destructible enities
Game.EntityMixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getBaseAttackValue: function() {
        return this._attackValue
    },
    getAttackValue: function() {
        var modifier = 0;
        if (this.hasMixin(Game.EntityMixins.BuffGetter)) {
            modifier += this.getBuffTotal('attack');
        }
        return this._attackValue + modifier;
    },
    attack: function(target) {
        // If the target is destructible, calculate the damage
        // based on attack and defense value
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var damage = Math.max(attack - defense, 0);

            Game.sendMessage(this, 'You strike the %s for %d damage!', 
                [target.getName(), damage]);
            Game.sendMessage(target, 'The %s strikes you for %d damage!', 
                [this.getName(), damage]);

            target.takeDamage(this, damage);
            if (this.hasMixin(Game.EntityMixins.BuffGetter)) {
                this.decrementBuffDuration('attack');
            }
        }
    },
    listeners: {
        onKill: function() {
            if (this.hasMixin(Game.EntityMixins.BuffGetter) && this.hasAbility('healOnKill')) {
                this.addHp(1);
                Game.sendMessage(this, "You feel better.");
            }
        },
        onDamageTaken: function(attacker) {
            if (this.hasMixin(Game.EntityMixins.BuffGetter) && this.hasAbility('zapOnHit') && attacker) {
                var damage = Math.max(1 - attacker.getDefenseValue() + this.getBuffTotal('attack'), 0);
                Game.sendMessage(this, 'Your storm shield zaps the %s for %s damage!', [attacker.getName(), damage]);
                attacker.takeDamage(this, damage);
                this.decrementBuffDuration('attack');
            }
        },
        details: function() {
            return [{key: 'attack', value: this.getAttackValue()}];
        }
    }
};

// This mixin signifies an entity can take damage and be destroyed
Game.EntityMixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
        this._maxHp = template['maxHp'] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the 
        // max specified.
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getBaseDefenseValue: function() {
        return this._defenseValue
    },
    getDefenseValue: function() {
        var modifier = 0;
        if (this.hasMixin(Game.EntityMixins.BuffGetter)) {
            modifier += this.getBuffTotal('defense');
        }
        return this._defenseValue + modifier;
    },
    getHp: function() {
        return this._hp;
    },
    getMaxHp: function() {
        return this._maxHp;
    },
    setHp: function(hp) {
        this._hp = hp;
    },
    addHp: function(hp) {
        this._hp = Math.min(this._hp + hp, this._maxHp);
    },
    increaseDefenseValue: function(value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the defense value.
        this._defenseValue += value;
        Game.sendMessage(this, "You look tougher!");
    },
    increaseMaxHp: function(value) {
        // If no value was passed, default to 10.
        value = value || 10;
        // Add to both max HP and HP.
        this._maxHp += value;
        this._hp += value;
        Game.sendMessage(this, "You look healthier!");
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        if (this.hasMixin(Game.EntityMixins.BuffGetter)) {
            this.decrementBuffDuration('defense');
        }
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            if (attacker) {
                Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
                attacker.raiseEvent('onKill', this);
            }
            this.raiseEvent('onDeath', attacker);
            this.kill();
        } else if (damage > 0) {
            this.raiseEvent('onDamageTaken', attacker);
            if (attacker) {
                attacker.raiseEvent('onDamageDealt', this);
            }
        }
    },
    listeners: {
        details: function() {
            return [
                {key: 'defense', value: this.getDefenseValue()},
                {key: 'hp', value: this.getHp()}
            ];
        }
    }
};

Game.EntityMixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this._messages = [];
    },
    receiveMessage: function(message) {
        this._messages.push(message);
    },
    getMessages: function() {
        return this._messages;
    },
    clearMessages: function() {
        this._messages = [];
    }
};

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function(template) {
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function() {
        return this._sightRadius;
    },
    increaseSightRadius: function(value) {
        // If no value was passed, default to 1.
        value = value || 1;
        // Add to sight radius.
        this._sightRadius += value;
        Game.sendMessage(this, "You are more aware of your surroundings!");
    },
    canSee: function(entity) {
        // If not on the same map or on different floors, then exit early
        if (!entity || this._map !== entity.getMap()) {
            return false;
        }

        var otherX = entity.getX();
        var otherY = entity.getY();

        // If we're not in a square field of view, then we won't be in a real
        // field of view either.
        if ((otherX - this._x) * (otherX - this._x) +
            (otherY - this._y) * (otherY - this._y) >
            this._sightRadius * this._sightRadius) {
            return false;
        }

        // Compute the FOV and check if the coordinates are in there.
        var found = false;
        this.getMap().getFov().compute(
            this.getX(), this.getY(), 
            this.getSightRadius(), 
            function(x, y, radius, visibility) {
                if (x === otherX && y === otherY) {
                    found = true;
                }
            });
        return found;
    },
    getVisibleTargets: function(distance) {
        var targets = [];
        var range = distance || this._sightRadius;
        var candidates = this.getMap().getEntitiesWithinRadius(this.getX(), this.getY(), range);
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (this.canSee(candidate) && candidate != this) {
                targets.push(candidate);
            }
        }
        return targets;
    }
};

// Message sending functions
Game.sendMessage = function(recipient, message, args) {
    // Make sure the recipient can receive the message 
    // before doing any work.
    if (recipient.hasMixin(Game.EntityMixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
};
Game.sendMessageNearby = function(map, centerX, centerY, message, args) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, 5);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.EntityMixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
};

Game.EntityMixins.Pious = {
    name: 'Pious',
    init: function(template) {
        this._favor = template['maxFavor'] || 3;
        this._blessingSlots = template['blessingSlots'] || 9;
        this._blessings = [];
    },
    getFavor: function() {
        return this._favor;
    },
    setFavor: function(n) {
        this._favor = n;
    },
    getBlessingSlotCount: function() {
        return this._blessingSlots;
    },
    getBlessings: function() {
        return this._blessings;
    },
    getBlessing: function(i) {
        return this._blessings[i];
    },
    addBlessing: function(b) {
        // Try to find a slot, returning true only if we could add the blesing.
        if (this._blessings.length < this._blessingSlots) {
            this._blessings.push(b)
            return true;
        }        return false;
    },
    removeBlessing: function(i) {
        Game.BlessingDeck.discard(this._blessings.splice(i, 1)[0]);
    },
    canAddBlessing: function() {
        return this._blessings.length < this._blessingSlots;
    },
    invokeBlessing: function(n) {
        var blessing = this._blessings[n - 1];
        if (this._favor >= blessing.favorCost) {
            this._favor -= blessing.favorCost;
            this.removeBlessing(n - 1);
            Game.sendMessage(this, blessing.message);
            blessing.action(this);
        } else
        Game.sendMessage(this, "You don't have enough favor. Ascend the citadel to gain more.");        
    }
};

Game.EntityMixins.CorpseDropper = {
    name: 'CorpseDropper',
    init: function(template) {
        // Chance of dropping a cropse (out of 100).
        this._corpseDropRate = template['corpseDropRate'] || 100;
    },
    listeners: {
        onDeath: function(attacker) {
            // Check if we leave drop a corpse.
            if (Math.round(Math.random() * 100) <= this._corpseDropRate) {
                // Draw a corpse tile.
                this._map.setTile(this.getX(), this.getY(), Game.Tile.corpseTile);
            }    
        }
    }
};
