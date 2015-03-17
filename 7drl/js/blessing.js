Game.Blessing = function(properties) {
    properties = properties || {};
    this.name =         properties['name'] || "";
    this.description =  properties['description'] || "";
    this.favorCost =    properties['favorCost'] || 1;
    this.blessingCost = properties['blessingCost'] || 0;
    this.hpCost       = properties['hpCost'] || 0;
    this.message       = properties['message'] || "";
    this.action       = properties['action'] || undefined;
};