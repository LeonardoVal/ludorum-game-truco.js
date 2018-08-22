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