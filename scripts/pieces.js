// Main class for pieces
// This logic will be the same for all pieces
class Piece {
    constructor(color, type) {
        // Determines white or black piece
        this.color = color

        // pawn, rook, knight, bishop, queen, king
        this.type = type
    }

    isValidMove(startPos, endPos, board) {
        return false
    }
}

class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn');
    }
}