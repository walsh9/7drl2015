Game.Deck = function(name) {
    this._name = name;
    this._deck = [];
    this._discards = []; 
}

Game.Deck.prototype.shuffle = function () {
    var shuffle = function (array) {
        var temporaryValue, randomIndex;
        var currentIndex = array.length;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    this._deck = this._deck.concat(this._discards)
    shuffle(this._deck);
}

Game.Deck.prototype.add = function(item) {
    this._deck.push(item);
}

Game.Deck.prototype.discard = function (item) {
    this._discards.push(item);
}

Game.Deck.prototype.draw = function (item) {
    if (this._deck.length > 0) {
        return this._deck.pop(item);
    } else {
        this.shuffle();
        return this._deck.pop(item);        
    }  
}


