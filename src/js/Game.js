'use strict'

// main game class
function Game(
    rows = ROWS,
    cols = COLS,
    enemies = ENEMIES,
    flasks = FLASKS,
    swords = SWORDS,
    rooms = ROOMS,
    way_x = WAY_X,
    way_y = WAY_Y
) {
    this.rows = rows
    this.cols = cols
    this.enemies_number = enemies
    this.flasks_number = flasks
    this.swords_number = swords
    this.rooms_num = rooms
    this.way_x_num = way_x
    this.way_y_num = way_y
    // set game to ready
    this.gameStatus = GAME_STATUS_LOADING
    // ai storage
    this.aiInterval = null
    // key listener
    this.keyListener = null
    this.enterListener = null
}

Game.prototype.reset = function () {
    // the 2d structure of the map
    this.map = []
    // the structure of the rooms
    this.rooms = []
    // the structure of ways
    this.ways_x = []
    this.ways_y = []
    // the structure of actors first actor is a PLAYER
    // other is enemies
    this.actors = []
    // items
    this.items = []
    // clear all divs
    var el = document.getElementsByClassName('field')[0]
    while (el.firstChild) el.removeChild(el.firstChild)
    // hide result
    hideDiv('game-status-result')
}

Game.prototype.init = function () {
    // reset game
    this.reset()
    // generate ways on x
    for (var way_x = 0; way_x < this.way_x_num; way_x++) {
        this.ways_x.push(randomInt(0, this.rows - 1, this.ways_x, 3))
    }
    // generate ways on y
    for (var way_y = 0; way_y < this.way_y_num; way_y++) {
        this.ways_y.push(randomInt(0, this.cols - 1, this.ways_y, 3))
    }
    // generate rooms
    for (var r = 0; r < this.rooms_num; r++) {
        var room = generateRoomBasedOnWays(
            this.ways_x,
            this.ways_y,
            this.cols,
            this.rows
        )
        this.rooms.push(room)
    }
    // generate random map
    for (var y = 0; y < this.rows; y++) {
        var newRow = []
        for (var x = 0; x < this.cols; x++) {
            // if point is on ways
            // or inside room
            if (
                this.ways_x.indexOf(y) > -1 ||
                this.ways_y.indexOf(x) > -1 ||
                checkInsideRooms(x, y, this.rooms)
            )
                newRow.push(FLOOR)
            // out of rooms and ways
            else newRow.push(WALL)
        }
        this.map.push(newRow)
    }
    // generate flasks
    for (var flask = 0; flask < this.flasks_number; flask++) {
        var [py, px] = generatePointEmpty(this.map)
        var item = new Item(
            'flask_' + flask,
            px,
            py,
            FLASK,
            function () {
                var newHP = this.actors[0].hp + 50
                if (newHP > 100) newHP = 100
                this.actors[0].hp = newHP
            }.bind(this)
        )
        this.items.push(item)
        // this.map[py][px] = FLASK
    }
    // generate swords
    for (var sword = 0; sword < this.swords_number; sword++) {
        var [py, px] = generatePointEmpty(this.map)
        var item = new Item(
            'sword_' + sword,
            px,
            py,
            SWORD,
            function () {
                this.actors[0].items.push(SWORD)
            }.bind(this)
        )
        this.items.push(item)
    }

    // generate hero
    var [py, px] = generatePointEmpty(this.map)
    var hero = new Actor('hero_0', HERO, px, py, HERO_HP, HERO_POWER)
    this.actors.push(hero)
    // generate enemyes
    for (var enemy = 0; enemy < this.enemies_number; enemy++) {
        var [py, px] = generatePointEmpty(this.map)
        var actor = new Actor(
            'actor_' + enemy,
            ENEMY,
            px,
            py,
            ENEMY_HP,
            ENEMY_POWER
        )
        this.actors.push(actor)
    }
    // drawing a map
    this.drawMap()

    // drawing an actors
    this.drawActors()

    // drawing an items
    this.drawItems()

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
    setInnerText('game-status-text', GAME_START)

    // update visuals
    updateHeroHP(HERO_HP)
    updateHeroPower(SWORD_POWER)
}

// map generator
Game.prototype.drawMap = function () {
    for (var row = 0; row < this.map.length; row++) {
        for (var col = 0; col < this.map[row].length; col++) {
            switch (this.map[row][col]) {
                case WALL:
                    addNewTile('', WALL, col, row)
                    break
                default:
                    addNewTile('', '', col, row)
                    break
            }
        }
    }
}

// draw actors
Game.prototype.drawActors = function () {
    // remove hero
    let hero = document.getElementsByClassName(HERO)
    if (hero[0]) hero[0].parentNode.removeChild(hero[0])
    // remove enemies
    let elements = document.getElementsByClassName(ENEMY)
    for (var e = 0; e < elements.length; e++) {
        elements[e].parentNode.removeChild(elements[e])
    }
    // add hero
    addNewTile(this.actors[0].id, HERO, this.actors[0].x, this.actors[0].y)
    addNewTile(
        this.actors[0].id + '_hp',
        'health',
        this.actors[0].x,
        this.actors[0].y,
        HERO,
        this.actors[0].hp
    )
    // add enemies
    for (var i = 1; i < this.actors.length; i++) {
        var actor = this.actors[i]
        if (actor.type == ENEMY) {
            var enemy = addNewTile(actor.id, ENEMY, actor.x, actor.y)
            addNewTile(
                actor.id + '_hp',
                'health',
                actor.x,
                actor.y,
                enemy,
                actor.hp
            )
        }
    }
}

// drow items
Game.prototype.drawItems = function () {
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i]
        switch (item.type) {
            case FLASK:
                addNewTile(item.id, FLASK, item.x, item.y)
                break
            case SWORD:
                addNewTile(item.id, SWORD, item.x, item.y)
                break
            default:
                break
        }
    }
}

// function to check that actor can move
Game.prototype.canActorMove = function (player, dir) {
    var isEnemy = false
    for (var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i]
        if (i == player.id) continue
        if (actor.x == player.x + dir.x && actor.y == player.y + dir.y)
            isEnemy = true
    }
    return (
        player.x + dir.x >= 0 &&
        player.x + dir.x <= COLS - 1 &&
        player.y + dir.y >= 0 &&
        player.y + dir.y <= ROWS - 1 &&
        this.map[player.y + dir.y][player.x + dir.x] == '.' &&
        !isEnemy
    )
}

// attack all enemies around hero
Game.prototype.attackOther = function (actor) {
    for (var i = 1; i < this.actors.length; i++) {
        if (i == actor.id) continue
        var curActor = this.actors[i]
        if (isActorNear(actor, curActor)) {
            curActor.hp = curActor.hp - actor.power
            if (curActor.hp < 0) curActor.hp = 0
            // update HP
            updateActorHP(curActor.id + '_hp', curActor.hp)
            // remove from map if killed
            if (curActor.hp == 0) {
                this.actors = this.actors.filter(function (a) {
                    return a.id != curActor.id
                })
                removeDiv(curActor.id)
            }
        }
    }
    // if no enemies = win
    if (this.actors.length == 1) {
        this.setGameStatus(GAME_STATUS_WIN)
        setInnerText('game-status-result', GAME_WIN)
        setDivClass('game-status-result', 'win')
        setInnerText('game-status-text', GAME_NEW)
        this.end()
    }
}

// move actor
Game.prototype.moveActor = function (actor, dir) {
    if (!this.canActorMove(actor, dir)) return false
    actor.x = actor.x + dir.x
    actor.y = actor.y + dir.y
    // move div
    let actorDiv = document.getElementById(actor.id)
    actorDiv.style.left = actor.x * TILE_SIZE + 'px'
    actorDiv.style.top = actor.y * TILE_SIZE + 'px'
    // take items for hero only
    if (actor.type == HERO) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i]
            if (actor.x == item.x && actor.y == item.y) {
                // if item is hp flask - add hp only if needed
                if (item.type == FLASK && actor.hp < 100) {
                    actor.hp = actor.hp + FLASK_HP
                    if (actor.hp > 100) actor.hp = 100
                    // update hero health
                    updateActorHP(actor.id + '_hp', actor.hp)
                    // update visuals
                    updateHeroHP(actor.hp)
                    // remove item from map
                    this.items = this.items.filter(function (val) {
                        return val.id != item.id
                    })
                    removeDiv(item.id)
                }
                // push item to hero
                if (item.type == SWORD) {
                    actor.items.push(item)
                    addToInventory(item)
                    actor.power = actor.power + SWORD_POWER
                    // update visuals
                    updateHeroPower(actor.power)
                    // remove item from map
                    this.items = this.items.filter(function (val) {
                        return val.id != item.id
                    })
                    removeDiv(item.id)
                }
            }
        }
    }
    return true
}

// basic enemies movements
Game.prototype.aiAct = function (player, actor) {
    var directions = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
    ]
    var dx = player.x - actor.x
    var dy = player.y - actor.y
    // if player is far away, walk randomly
    if (Math.abs(dx) + Math.abs(dy) > 6)
        // try to walk in random directions until you succeed once
        while (
            !this.moveActor(
                actor,
                directions[randomInt(0, directions.length - 1)]
            )
        ) {}
    // otherwise walk towards player
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
            // left
            this.moveActor(actor, directions[0])
        } else {
            // right
            this.moveActor(actor, directions[1])
        }
    } else {
        if (dy < 0) {
            // up
            this.moveActor(actor, directions[2])
        } else {
            // down
            this.moveActor(actor, directions[3])
        }
    }
    // if player next to enemy
    if (isActorNear(actor, player)) {
        player.hp = player.hp - ENEMY_POWER
        if (player.hp < 0) player.hp = 0
        updateActorHP(player.id + '_hp', player.hp)
        updateHeroHP(player.hp)
    }
    if (player.hp == 0) {
        // game over message
        this.setGameStatus(GAME_STATUS_GAME_OVER)
        setInnerText('game-status-result', GAME_OVER)
        setDivClass('game-status-result', 'gameover')
        setInnerText('game-status-text', GAME_NEW)
        this.end()
    }
}

// change game statuses
Game.prototype.setGameStatus = function (status) {
    this.gameStatus = status
}

// add handlers to document
Game.prototype.start = function () {
    this.gameStatus = GAME_STATUS_PROCESS
    // init movements for game
    this.keyListener = function (event) {
        switch (event.code) {
            case 'KeyW':
                this.moveActor(this.actors[0], { x: 0, y: -1 })
                break
            case 'KeyA':
                this.moveActor(this.actors[0], { x: -1, y: 0 })
                break
            case 'KeyD':
                this.moveActor(this.actors[0], { x: 1, y: 0 })
                break
            case 'KeyS':
                this.moveActor(this.actors[0], { x: 0, y: 1 })
                break
            case 'Space':
                this.attackOther(this.actors[0])
                break
        }
    }.bind(this)

    document.addEventListener('keydown', this.keyListener)

    // set interval to enemies actions
    this.aiInterval = setInterval(
        function () {
            for (var e = 1; e < this.actors.length; e++) {
                this.aiAct(this.actors[0], this.actors[e], this.map, this.items)
            }
        }.bind(this),
        500
    )

    // hide overlay
    hideDiv('game-status')
}

// remove handlers from document
Game.prototype.end = function () {
    // remove listeners
    document.removeEventListener('keydown', this.keyListener)
    clearInterval(this.aiInterval)

    // show overlay
    showDiv('game-status')
    showDiv('game-status-result')
}
