Game.BlessingRepository = new Game.Repository('blessings', Game.Blessing);

Game.BlessingRepository.define("Sword of the Sea", {
    name: "Sword of the Sea",
    description: "An enduring +1 bonus to all damage dealt.",
    message: "You are enveloped in a green aura.",
});

Game.BlessingRepository.define("Ocean's Wrath", {
    name: "Ocean's Wrath",
    description: "Deal 1 damage to all enemies in line of sight",    
    message: "Lightning radiates from your feet!",    
});

Game.BlessingRepository.define("Ocean's Bounty", {
    name: "Ocean's Bounty",
    description: "Instantly make 3 new blessings available.",    
    message: "Leviathan smiles upon you.",    
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
});

