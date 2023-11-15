// game state manager
class GameState {
    constructor(
        actors,
        map,
        items,
        rows = ROWS,
        cols = COLS,
        enemies = ENEMIES,
        flasks = FLASKS,
        swords = SWORDS,
        rooms_num = ROOMS,
        way_x = WAY_X,
        way_y = WAY_Y,
        rooms = [],
        ways_x = [],
        ways_y = []
    ) {
        // the structure of actors first actor is a PLAYER
        // other is enemies
        this.actors = actors
        // the 2d structure of the map
        this.map = map
        // items
        this.items = items
        this.rows = rows
        this.cols = cols
        this.enemies_number = enemies
        this.flasks_number = flasks
        this.swords_number = swords
        this.rooms_num = rooms_num
        this.way_x_num = way_x
        this.way_y_num = way_y
        // the structure of the rooms
        this.rooms = rooms
        // the structure of ways
        this.ways_x = ways_x
        this.ways_y = ways_y
    }
    init() {
        this.map = []
        this.actors = []
        this.items = []
        this.#initMap()
        this.#initItems()
        this.#initActors()
    }
    #initMap() {
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
            var room = this.#generateRoomBasedOnWays(
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
                    this.#checkInsideRooms(x, y, this.rooms)
                )
                    newRow.push(FLOOR)
                // out of rooms and ways
                else newRow.push(WALL)
            }
            this.map.push(newRow)
        }
    }
    #initActors() {
        // generate hero
        var [py, px] = this.#generatePointEmpty(this.map)
        var hero = new Actor('hero_0', HERO, px, py, HERO_HP, HERO_POWER, [])
        this.actors.push(hero)
        // generate enemyes
        for (var enemy = 0; enemy < this.enemies_number; enemy++) {
            var [py, px] = this.#generatePointEmpty(this.map)
            var actor = new Actor(
                'actor_' + enemy,
                ENEMY,
                px,
                py,
                ENEMY_HP,
                ENEMY_POWER,
                []
            )
            this.actors.push(actor)
        }
        this.observeToActors()
    }
    observeToActors() {
        // set map and actors state
        for (var a = 0; a < this.actors.length; a++) {
            this.actors[a].setMap(this.map)
            this.actors[a].setActors(this.actors)
            this.actors[a].setItems(this.items)
        }
    }
    #initItems() {
        // generate flasks
        for (var flask = 0; flask < this.flasks_number; flask++) {
            var [py, px] = this.#generatePointEmpty(this.map)
            var item = new Item(
                'flask_' + flask,
                px,
                py,
                FLASK,
                function () {
                    var newHP = this.player.hp + 50
                    if (newHP > 100) newHP = 100
                    this.player.hp = newHP
                }.bind(this)
            )
            this.items.push(item)
        }
        // generate swords
        for (var sword = 0; sword < this.swords_number; sword++) {
            var [py, px] = this.#generatePointEmpty(this.map)
            var item = new Item(
                'sword_' + sword,
                px,
                py,
                SWORD,
                function () {
                    this.player.items.push(SWORD)
                }.bind(this)
            )
            this.items.push(item)
        }
    }
    // generate random point on emply space
    #generatePointEmpty(map) {
        var x = randomInt(0, COLS - 1)
        var y = randomInt(0, ROWS - 1)
        if (map[y][x] !== FLOOR) return this.#generatePointEmpty(map)
        else return [y, x]
    }

    // check point is inside one of the rooms
    #checkInsideRooms(point_x, point_y, rooms) {
        for (var i = 0; i < rooms.length; i++) {
            if (
                isInsideBox(
                    point_x,
                    point_y,
                    rooms[i][0],
                    rooms[i][1],
                    rooms[i][2],
                    rooms[i][3]
                )
            )
                return true
        }
        return false
    }

    // add rooms based on hallway location
    // to have at least one path (x+y) inside every room
    #generateRoomBasedOnWays(ways_x, ways_y, max_cols, max_rows) {
        var room_w = randomInt(ROOM_MIN_SIZE, ROOM_MAX_SIZE)
        var room_h = randomInt(ROOM_MIN_SIZE, ROOM_MAX_SIZE)
        var room_x = randomInt(0, max_cols)
        var room_y = randomInt(0, max_rows)
        var isX,
            isY = false
        for (var x = 0; x < ways_x.length; x++) {
            // if room has hallway throw X
            if (ways_x[x] >= room_x && ways_x[x] <= room_x + room_w) isX = true
        }
        for (var y = 0; y < ways_y.length; y++) {
            // if room has hallway throw Y
            if (ways_y[y] >= room_y && ways_y[y] <= room_y + room_h) isY = true
        }
        if (isX && isY) return [room_x, room_y, room_w, room_h]
        return this.#generateRoomBasedOnWays(ways_x, ways_y, max_cols, max_rows)
    }
    getMap() {
        return this.map
    }
    getItems() {
        return this.items
    }
    // remove item from array
    removeFromItems(id) {
        this.items = this.items.filter(function (val) {
            return val.id != id
        })
    }
    //remove actor
    removeActor(id) {
        this.actors = this.actors.filter(function (a) {
            return a.id != id
        })
    }
    getActors() {
        return this.actors
    }
    getHero() {
        return this.actors[0]
    }
    getEnemies() {
        return this.actors.slice(1, this.actors.length - 1)
    }
    setMap(map) {
        this.map = map
    }
    setItems(map) {
        this.map = map
    }
    setActors(map) {
        this.map = map
    }
}
