var Game =  {
	_display: null,
    _currentScreen: null,
    _screenWidth: 60,
    _screenHeight: 24,
	init: function() {
        // Any necessary initialization will go here.
        var options = {
            width: this._screenWidth + 20,
            height: this._screenHeight,
            fontFamily: '"Droid Sans Mono", monospace',
        }

        var hammertime = new Hammer(document.body, {domEvents: true});
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL, velocity: 0.1 });
        hammertime.get('tap').set({ interval: 0});

        this._display = new ROT.Display(options);
        // Create a helper function for binding to an event
        // and making it send it to the screen
        var game = this; // So that we don't lose this
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (game._currentScreen !== null) {
                    // Send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
                    console.log(e);
                }
            });
        };
        // Bind keyboard input events
        bindEventToScreen('keydown');
        //bindEventToScreen('keyup');
        bindEventToScreen('keypress');
        //bindEventToScreen('keyup');
        bindEventToScreen('tap');
        bindEventToScreen('swipeleft');
        bindEventToScreen('swiperight');
        bindEventToScreen('swipeup');
        bindEventToScreen('swipedown');
        document.querySelector('.keyboard').addEventListener('tap', function(e) {
            document.querySelector('.keyboard').className = "hidden";
            document.querySelector('#touchcontrols').className = "";
        });
        document.querySelector('.bh').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_H});
        });
        document.querySelector('.bj').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_J});
        });
        document.querySelector('.bk').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_K});
        });
        document.querySelector('.bl').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_L});
        });
        document.querySelector('.bp').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_PERIOD});
        });
        document.querySelector('.b1').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_1});
        });
        document.querySelector('.b2').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_2});
        });
        document.querySelector('.b3').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_3});
        });
        document.querySelector('.b4').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_4});
        });
        document.querySelector('.b5').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_5});
        });
        document.querySelector('.b6').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_6});
        });
        document.querySelector('.b7').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_7});
        });
        document.querySelector('.b8').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_8});
        });
        document.querySelector('.b9').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_9});
        });
        document.querySelector('.bq').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keypress', {charCode: 63});
        });
        document.querySelector('.bb').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_B});
        });
        document.querySelector('.be').addEventListener('tap', function(e) {
            game._currentScreen.handleInput('keydown', {keyCode: ROT.VK_E});
        });
    },
	getDisplay: function() {
		return this._display;
	},
	getScreenWidth: function() {
    return this._screenWidth;
	},
	getScreenHeight: function() {
	    return this._screenHeight;
	},
    refresh: function() {
        // Clear the screen
        this._display.clear();
        // Render the screen
        this._currentScreen.render(this._display);
    },
	switchScreen: function(screen) {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();
        // Update our current screen, notify it we entered
        // and then render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    }
};

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        // Add the container to our HTML page
        document.getElementById('game').appendChild(Game.getDisplay().getContainer());
        // Load the start screen
        Game.switchScreen(Game.Screen.startScreen);
    }
};