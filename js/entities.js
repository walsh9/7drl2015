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

Game.EntityRepository.define('lobsterknight', {
    name: 'lobsterknight',
    character: 'L',
    foreground: 'red',
    maxHp: 3,
    defenseValue: 1,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    description: 'Their hard shells block 1 point of damage.',
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('hatchling', {
    name: 'hatchling',
    character: 'l',
    foreground: 'red',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    description: 'Their shells are still soft.',
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('mercenary crabfolk x', {
    name: 'crabfolk merc',
    character: 'u',
    foreground: 'cyan',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['huntX', 'wanderX'],
    description: 'Can only walk sideways.',
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('mercenary crabfolk y', {
    name: 'crabfolk merc',
    character: 'c',
    foreground: 'cyan',
    maxHp: 3,
    sightRadius: 5,
    tasks: ['huntY', 'wanderY'],
    description: 'Can only walk sideways.',
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('guard snail', {
    name: 'guard snail',
    character: 's',
    foreground: 'green',
    speed: 500,
    maxHp: 3,
    defenseValue: 1,
    sightRadius: 5,
    tasks: ['slimeHunt', 'slime'],
    description: 'Hard shell. Leaves toxic slime trails. Slow.',
    mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
             Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
             Game.EntityMixins.CorpseDropper]
});
