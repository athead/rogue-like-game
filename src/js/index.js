'use strict'

// map dimensions
var ROWS = 24
var COLS = 40
// number of enemies
var ENEMIES = 10
// number of HP flasks
var FLASKS = 10
var FLASK_HP = 50
// number of swords
var SWORDS = 2
var SWORD_POWER = 40
// hero settings
var HERO_POWER = 20
var HERO_HP = 50
// enemies settings
var ENEMY_POWER = 10
var ENEMY_HP = 100
// rooms settings
var ROOM_MIN_SIZE = 3
var ROOM_MAX_SIZE = 8
var ROOMS = 10 // randomInt(5, 10)
// number of hallway
var WAY_X = randomInt(3, 5)
var WAY_Y = randomInt(3, 5)

// tile types
var FLOOR = '.'
var WALL = 'tileW'
var ENEMY = 'tileE'
var HERO = 'tileP'
var FLASK = 'tileHP'
var SWORD = 'tileSW'

// other options
var TILE_SIZE = 25
var GAME_STATUS_LOADING = 'LOADING'
var GAME_STATUS_START = 'START'
var GAME_STATUS_PROCESS = 'PROCESS'
var GAME_STATUS_WIN = 'WIN'
var GAME_STATUS_GAME_OVER = 'GAME_OVER'

// game messages
var GAME_START = 'Нажмите ENTER для старта'
var GAME_NEW = 'Нажмите ENTER для новой игры'
var GAME_OVER = 'Вы проиграли =('
var GAME_WIN = 'Вы выиграли!'

// restrict default keys
function RestrictKeys() {
    if (
        event.code == 'KeyW' ||
        event.code == 'KeyA' ||
        event.code == 'KeyS' ||
        event.code == 'KeyD' ||
        event.code == 'Space' ||
        event.code == 'Enter'
    ) {
        return false
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // init game
    var game = new Game()
    game.init()
})
