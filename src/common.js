/** # Common functions and utilities.

TODO
*/

/**
 * A card move is represented by an object with a player (who throws the card)
 * and a number, which is the index of the thrown card
 *
 * Note that cards are sorted in ascending order so index is consistent
 */

/**
 * Funcion que recibe por parametro la mano actual de un jugador, y retorna los posibles movimientos.
 */

function generateMoves(cards) {
    var moves = [];
    for (var i = 0; i < cards.length; i++) {
        moves.push(i);
    }
    return moves;
}

function arrEq(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

function envidoTotal(cards) {
    var a = envido(cards[0], cards[1]);
    var b = envido(cards[0], cards[2]);
    var c = envido(cards[1], cards[2]);

    return Math.max(a, b, c);
}

/**
 * Cada carta se representa con un entero del 0 al 39.
 *
 * Dado que hay 10 cartas de cada palo, y son 4 palos,
 * el palo de una carta n es n mod 4.
 *
 * Su número es n // 4 + 1 (para hacerlo de 1 a 10).
 *
 * PALOS
 * 0 - Espada
 * 1 - Basto
 * 2 - Oro
 * 3 - Copa
 *
 * CARTAS
 * 1..7 - 1..7
 * 8 - 10
 * 9 - 11
 * 10 - 12
 */

function envido(a, b) {
    var valor = (a % 4) == (b % 4) ? 20 : 0;
    var numA = ~~(a / 4) + 1;
    var numB = ~~(b / 4) + 1;
    if (numA < 8) {
        valor += numA;
    }
    if (numB < 8) {
        valor += numB;
    }
    return valor;
}