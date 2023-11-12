'use strict'

// add new block to game field (universal)
function addNewTile(id, type, left, top, parentClass = 'field', width = 0) {
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

// generate random point on emply space
function generatePointEmpty(map) {
    var x = randomInt(0, COLS - 1)
    var y = randomInt(0, ROWS - 1)
    if (map[y][x] !== FLOOR) return generatePointEmpty(map)
    else return [y, x]
}

// check point is inside one of the rooms
function checkInsideRooms(point_x, point_y, rooms) {
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
function generateRoomBasedOnWays(ways_x, ways_y, max_cols, max_rows) {
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
    return generateRoomBasedOnWays(ways_x, ways_y, max_cols, max_rows)
}

// add item to inventory
function addToInventory(item) {
    if (item.type == SWORD) {
        addNewTile('', SWORD, '', '', 'inventory')
    }
}

// update actor div HP
function updateActorHP(id, hp) {
    // update style
    let tileHP = document.getElementById(id)
    tileHP.style.width = hp + '%'
}
// update heroe bottom screen HP
function updateHeroHP(hp) {
    // update style
    let tileHP = document.getElementById('hero-hp')
    tileHP.innerText = hp
}

function updateHeroPower(power) {
    // update style
    let tileHP = document.getElementById('hero-power')
    tileHP.innerText = power
}

// remove div from a fiels
function removeDiv(id) {
    // remove item
    let item = document.getElementById(id)
    item.parentNode.removeChild(item)
}
