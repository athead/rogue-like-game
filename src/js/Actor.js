class Actor {
    // class for working with actors
    constructor(
        id = 0,
        type = ENEMY,
        x = 0,
        y = 0,
        hp = 100,
        power = 10,
        inventory = [],
        items,
        map,
        actors
    ) {
        this.items = items
        this.map = map
        this.actors = actors
        this.id = id
        this.hp = hp
        this.type = type
        this.power = power
        this.x = x
        this.y = y
        this.inventory = inventory
        this.GUI = new GUI()
    }

    setMap(map) {
        this.map = map
    }
    setActors(actors) {
        this.actors = actors
    }
    setItems(items) {
        this.items = items
    }

    getHP() {
        return this.hp
    }
    removeHP(hp) {
        var newHP = this.hp - hp
        if(newHP < 0) newHP = 0
        this.hp = newHP
        this.GUI.updateActorHP(this.id + '_hp', this.hp)
    }
    addHP(hp) {
        var newHP = this.hp + hp
        if (newHP > 100) newHP = 100
        this.hp = newHP
        this.GUI.updateActorHP(this.id + '_hp', this.hp)
    }
    getPower() {
        return this.power
    }
    setPower(power) {
        this.power = power
    }
    addPower(power) {
        this.power = this.power + power
    }
    addToInventory(item) {
        this.inventory.push(item)
    }
    // helper to detect nearest actors
    #isActorNearTo(actor2) {
        return (
            (this.x == actor2.x + 1 && this.y == actor2.y + 1) ||
            (this.x == actor2.x - 1 && this.y == actor2.y + 1) ||
            (this.x == actor2.x + 1 && this.y == actor2.y - 1) ||
            (this.x == actor2.x - 1 && this.y == actor2.y - 1) ||
            (this.x == actor2.x && this.y == actor2.y - 1) ||
            (this.x == actor2.x && this.y == actor2.y + 1) ||
            (this.x == actor2.x - 1 && this.y == actor2.y) ||
            (this.x == actor2.x + 1 && this.y == actor2.y)
        )
    }

    // function to check that actor can move
    #canActorMove(dir) {
        var isEnemy = false

        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i]
            if (i == this.id) continue
            if (actor.x == this.x + dir.x && actor.y == this.y + dir.y)
                isEnemy = true
        }
        return (
            this.x + dir.x >= 0 &&
            this.x + dir.x <= COLS - 1 &&
            this.y + dir.y >= 0 &&
            this.y + dir.y <= ROWS - 1 &&
            this.map[this.y + dir.y][this.x + dir.x] == '.' &&
            !isEnemy
        )
    }

    // move actor
    moveActor(dir) {
        if (!this.#canActorMove(dir)) return false
        this.x = this.x + dir.x
        this.y = this.y + dir.y
        // move div
        this.GUI.moveDiv(this.id, this.x * TILE_SIZE, this.y * TILE_SIZE)
        return true
    }

    // basic enemies movements
    aiAct(player) {
        //actor
        var directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ]
        var dx = player.x - this.x
        var dy = player.y - this.y
        // if player is far away, walk randomly
        if (Math.abs(dx) + Math.abs(dy) > 6)
            // try to walk in random directions until you succeed once
            this.moveActor(directions[randomInt(0, directions.length - 1)])
        // otherwise walk towards player
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                // left
                this.moveActor(directions[0])
            } else {
                // right
                this.moveActor(directions[1])
            }
        } else {
            if (dy < 0) {
                // up
                this.moveActor(directions[2])
            } else {
                // down
                this.moveActor(directions[3])
            }
        }
        // if player next to enemy
        if (this.#isActorNearTo(player)) {
            player.removeHP(ENEMY_POWER)
            this.GUI.updateActorHP(player.id + '_hp', player.hp)
            this.GUI.updateHeroHP(player.hp)
        }
    }
}
