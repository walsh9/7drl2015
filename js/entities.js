// Player template
Game.PlayerTemplate = {
    name: 'you',
    character: '@',
    foreground: 'white',
    maxHp: 10,
    maxFavor: 3,
    attackValue: 2,
    sightRadius: 6,
    mixins: [Game.EntityMixins.PlayerActor,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.Sight, Game.EntityMixins.MessageRecipient,
             Game.EntityMixins.Pious, Game.EntityMixins.BuffGetter]
};

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('lobsterfolk knight', {
    name: 'lobster knight',
    character: 'L',
    foreground: 'red',
    maxHp: 3,
    defenseValue: 1,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('lobsterfolk hatchling', {
    name: 'lobster hatchling',
    character: 'l',
    foreground: 'red',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('mercenary crabfolk x', {
    name: 'mercenary crabfolk',
    character: 'u',
    foreground: 'blue',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['huntX', 'wanderX'],
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('mercenary crabfolk y', {
    name: 'mercenary crabfolk',
    character: 'c',
    foreground: 'blue',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['huntY', 'wanderY'],
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('guard snail', {
    name: 'guard snail',
    character: 's',
    foreground: 'green',
    speed: 500,
    maxHp: 4,
    defenseValue: 1,
    sightRadius: 5,
    tasks: ['slimeHunt', 'slime'],
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});
