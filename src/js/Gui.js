class GUI {
    constructor(map = [], items = [], actors = []) {
        this.map = map
        this.items = items
        this.actors = actors
    }

    init() {
        // drawing a map
        this.#drawMap()

        // drawing an actors
        this.#drawActors()

        // drawing an items
        this.#drawItems()

        // clear inventory
        this.#clearInventory()
    }

    // change inner text for dom element
    setInnerText(id, text) {
        var item = document.getElementById(id)
        item.innerText = text
    }

    // change element class
    setDivClass(id, className) {
        var item = document.getElementById(id)
        item.className = ''
        item.classList.add(className)
    }

    // hide div from view
    hideDiv(id) {
        var item = document.getElementById(id)
        item.style.display = 'none'
    }

    // hide div from view
    showDiv(id) {
        var item = document.getElementById(id)
        item.style.display = 'block'
    }

    // add new block to game field (universal)
    #addNewTile(id, type, left, top, parentClass = 'field', width = 0) {
        // get parent element
        var parentElement = parentClass
        if (typeof parentClass == 'string')
            parentElement = document.getElementsByClassName(parentClass)[0]
        if (!parentElement) return
        var newElement = document.createElement('div')
        newElement.setAttribute('id', id)
        if (type) newElement.classList.add(type)
        if (width) newElement.style.width = width + '%'
        else {
            newElement.classList.add('tile')
            newElement.style.left = left * TILE_SIZE + 'px'
            newElement.style.top = top * TILE_SIZE + 'px'
        }
        parentElement.appendChild(newElement)
        return newElement
    }

    // add item to inventory
    addToInventory(item) {
        if (item.type == SWORD) {
            this.#addNewTile('', SWORD, '', '', 'inventory')
        }
    }

    // update actor div HP
    updateActorHP(id, hp) {
        // update style
        let tileHP = document.getElementById(id)
        tileHP.style.width = hp + '%'
    }
    // update heroe bottom screen HP
    updateHeroHP(hp) {
        // update style
        let tileHP = document.getElementById('hero-hp')
        tileHP.innerText = hp
    }

    updateHeroPower(power) {
        // update style
        let tileHP = document.getElementById('hero-power')
        tileHP.innerText = power
    }

    // remove div from a fiels
    removeDiv(id) {
        // remove item
        let item = document.getElementById(id)
        item.parentNode.removeChild(item)
    }

    // move tile
    moveDiv(id, x, y) {
        let item = document.getElementById(id)
        item.style.left = x + 'px'
        item.style.top = y + 'px'
    }
    // map generator
    #drawMap() {
        // clear all divs
        var el = document.getElementsByClassName('field')[0]
        while (el.firstChild) el.removeChild(el.firstChild)
        for (var row = 0; row < this.map.length; row++) {
            for (var col = 0; col < this.map[row].length; col++) {
                switch (this.map[row][col]) {
                    case WALL:
                        this.#addNewTile('', WALL, col, row)
                        break
                    default:
                        this.#addNewTile('', '', col, row)
                        break
                }
            }
        }
    }

    // draw actors
    #drawActors() {
        // remove hero
        let hero = document.getElementsByClassName(HERO)
        if (hero[0]) hero[0].parentNode.removeChild(hero[0])
        // remove enemies
        let elements = document.getElementsByClassName(ENEMY)
        for (var e = 0; e < elements.length; e++) {
            elements[e].parentNode.removeChild(elements[e])
        }
        // add hero
        this.#addNewTile(
            this.#player().id,
            HERO,
            this.#player().x,
            this.#player().y
        )
        this.#addNewTile(
            this.#player().id + '_hp',
            'health',
            this.#player().x,
            this.#player().y,
            HERO,
            this.#player().hp
        )
        // add enemies
        for (var i = 0; i < this.#enemies().length; i++) {
            var actor = this.#enemies()[i]
            if (actor.type == ENEMY) {
                var enemy = this.#addNewTile(actor.id, ENEMY, actor.x, actor.y)
                this.#addNewTile(
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
    // clear inventory
    #clearInventory() {
        var el = document.getElementsByClassName('inventory')[0]
        while (el.firstChild) el.removeChild(el.firstChild)
    }
    // drow items
    #drawItems() {
        // draw items
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i]
            switch (item.type) {
                case FLASK:
                    this.#addNewTile(item.id, FLASK, item.x, item.y)
                    break
                case SWORD:
                    this.#addNewTile(item.id, SWORD, item.x, item.y)
                    break
                default:
                    break
            }
        }
    }
    #player() {
        return this.actors[0]
    }

    #enemies() {
        return this.actors.slice(1, this.actors.length - 1)
    }
}
