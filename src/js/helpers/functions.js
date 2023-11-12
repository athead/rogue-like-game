'use strict'

// generate random integer
function randomInt(min, max, except = [], spread = 0) {
    try {
        var num = Math.floor(min + Math.random() * (max + 1 - min))
        for (var i = 0; i < except.length; i++) {
            // if generated number equals or inside spread call funcion again
            if (
                (num <= except[i] + spread && num >= except[i] - spread) ||
                except[i] === num
            )
                return randomInt(min, max, except, spread)
        }
        return num
    } catch {}
}

// check point inside box
function isInsideBox(point_x, point_y, box_x, box_y, box_w, box_h) {
    if (
        point_x >= box_x &&
        point_x <= box_x + box_w &&
        point_y >= box_y &&
        point_y <= box_y + box_h
    )
        return true
    return false
}

// change inner text for dom element
function setInnerText(id, text) {
    var item = document.getElementById(id)
    item.innerText = text
}

// change element class
function setDivClass(id, className) {
    var item = document.getElementById(id)
    item.className = ''
    item.classList.add(className)
}

// hide div from view
function hideDiv(id) {
    var item = document.getElementById(id)
    item.style.display = 'none'
}

// hide div from view
function showDiv(id) {
    var item = document.getElementById(id)
    item.style.display = 'block'
}
