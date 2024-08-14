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

    isValidMove = (startPos, endPos, board) => {
        const direction = this.color === 'white' ? -1 : 1
        const startRow = startPos[0]
        const startCol = startPos[1]
        const endRow = endPos[0]
        const endCol = endPos[1]

        // Normal Move
        
    }
}


export { Piece, Pawn }