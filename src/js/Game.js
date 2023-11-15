// class for working with items
function Item(id, x, y, type, cb) {
    this.id = id
    this.x = x
    this.y = y
    this.type = type
    this.cb = cb
}

class Game extends GameState {
    // main game class
    constructor(map, actors, items) {
        super(map, actors, items)
        // set game to ready
        this.gameStatus = GAME_STATUS_LOADING
        // ai storage
        this.aiInterval = null
        // key listener
        this.keyListener = null
        this.enterListener = null
        // GUI manager
        this.GUI = null
        // State manager
        this.gameState = null
    }

    init() {
        // hide result if has
        if (this.GUI) this.GUI.hideDiv('game-status-result')

        // init state
        this.gameState = new GameState()
        this.gameState.init()

        // init gui
        this.GUI = new GUI(
            this.gameState.getMap(),
            this.gameState.getItems(),
            this.gameState.getActors()
        )
        this.GUI.init()

        // set status to ready
        this.setGameStatus(GAME_STATUS_START)

        this.enterListener = function (event) {
            if (event.code == 'Enter') {
                if (this.gameStatus == GAME_STATUS_START) this.start()
                if (
                    this.gameStatus == GAME_STATUS_WIN ||
                    this.gameStatus == GAME_STATUS_GAME_OVER
                )
                    this.init()
                this.isENterListenerInited = true
            }
        }.bind(this)
        // add event listener
        if (!this.isENterListenerInited)
            document.addEventListener('keydown', this.enterListener)

        // set status text
        this.GUI.setInnerText('game-status-text', GAME_START)

        // update visuals
        this.GUI.updateHeroHP(HERO_HP)
        this.GUI.updateHeroPower(SWORD_POWER)
    }

    // change game statuses
    setGameStatus(status) {
        this.gameStatus = status
    }

    // add handlers to document
    start() {
        this.gameStatus = GAME_STATUS_PROCESS
        // init movements for game
        this.keyListener = function (event) {
            switch (event.code) {
                case 'KeyW':
                    this.move({ x: 0, y: -1 })
                    break
                case 'KeyA':
                    this.move({ x: -1, y: 0 })
                    break
                case 'KeyD':
                    this.move({ x: 1, y: 0 })
                    break
                case 'KeyS':
                    this.move({ x: 0, y: 1 })
                    break
                case 'Space':
                    this.attack()
                    break
            }
        }.bind(this)

        document.addEventListener('keydown', this.keyListener)

        // set interval to enemies actions
        this.aiInterval = setInterval(
            function () {
                for (var e = 0; e < this.#enemies().length; e++) {
                    var actor = this.#enemies()[e]
                    actor.aiAct(this.#player())
                }
                if (this.#player().hp == 0) {
                    // game over message
                    this.setGameStatus(GAME_STATUS_GAME_OVER)
                    this.GUI.setInnerText('game-status-result', GAME_OVER)
                    this.GUI.setDivClass('game-status-result', 'gameover')
                    this.GUI.setInnerText('game-status-text', GAME_NEW)
                    this.end()
                }
            }.bind(this),
            500
        )

        // hide overlay
        this.GUI.hideDiv('game-status')
    }

    // attack all enemies around hero
    attack() {
        var player = this.#player()
        for (var i = 1; i < this.gameState.getActors().length; i++) {
            if (i == player.id) continue
            var curActor = this.gameState.getActors()[i]
            if (player.isActorNearTo(curActor)) {
                curActor.removeHP(player.power)
                // remove from map if killed
                if (curActor.getHP() == 0) {
                    this.gameState.removeActor(curActor.id)
                    this.gameState.observeToActors()
                    this.GUI.removeDiv(curActor.id)
                }
            }
        }
        // if no enemies = win
        if (this.gameState.getEnemies().length == 0) {
            this.setGameStatus(GAME_STATUS_WIN)
            this.GUI.setInnerText('game-status-result', GAME_WIN)
            this.GUI.setDivClass('game-status-result', 'win')
            this.GUI.setInnerText('game-status-text', GAME_NEW)
            this.end()
        }
    }

    // move actor
    move(dir) {
        var player = this.#player()
        player.moveActor(dir)
        // take items for hero only
        for (var i = 0; i < this.gameState.getItems().length; i++) {
            var item = this.gameState.getItems()[i]
            if (player.x == item.x && player.y == item.y) {
                // if item is hp flask - add hp only if needed
                if (item.type == FLASK && player.getHP() < 100) {
                    // update hero health
                    player.addHP(player.getHP() + FLASK_HP)
                    // update visuals
                    this.GUI.updateHeroHP(player.hp)
                    // remove item from map
                    this.gameState.removeFromItems(item.id)
                    this.GUI.removeDiv(item.id)
                }
                // push item to hero
                if (item.type == SWORD) {
                    player.addToInventory(item)
                    this.GUI.addToInventory(item)
                    player.addPower(SWORD_POWER)
                    // update visuals
                    this.GUI.updateHeroPower(player.power)
                    // remove item from map
                    this.gameState.removeFromItems(item.id)
                    this.GUI.removeDiv(item.id)
                }
            }
        }
    }

    // remove handlers from document
    end() {
        // remove listeners
        document.removeEventListener('keydown', this.keyListener)
        clearInterval(this.aiInterval)

        // show overlay
        this.GUI.showDiv('game-status')
        this.GUI.showDiv('game-status-result')
    }

    #player() {
        return this.gameState.getHero()
    }

    #enemies() {
        return this.gameState.getEnemies()
    }
}
