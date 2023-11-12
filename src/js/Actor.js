// class for working with actors
function Actor(
    id = 0,
    type = ENEMY,
    x = 0,
    y = 0,
    hp = 100,
    power = 10,
    items = []
) {
    this.id = id
    this.hp = hp
    this.type = type
    this.power = power
    this.x = x
    this.y = y
    this.items = items
}

// helper to detect nearest actors
function isActorNear(actor1, actor2) {
    return (
        (actor1.x == actor2.x + 1 && actor1.y == actor2.y + 1) ||
        (actor1.x == actor2.x - 1 && actor1.y == actor2.y + 1) ||
        (actor1.x == actor2.x + 1 && actor1.y == actor2.y - 1) ||
        (actor1.x == actor2.x - 1 && actor1.y == actor2.y - 1) ||
        (actor1.x == actor2.x && actor1.y == actor2.y - 1) ||
        (actor1.x == actor2.x && actor1.y == actor2.y + 1) ||
        (actor1.x == actor2.x - 1 && actor1.y == actor2.y) ||
        (actor1.x == actor2.x + 1 && actor1.y == actor2.y)
    )
}
