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
        // Pawn Examle --> 
        // startPos --> [6, 0] 
        // endPos --> [5, 0]
        console.log(startPos, endPos)
        const direction = this.color === 'white' ? -1 : 1
        
        // Starting and ending positions for rows and columns
        const startRow = startPos[0]
        const startCol = startPos[1]
        const endRow = endPos[0]
        const endCol = endPos[1]

        // Move Forward: Check if the pawn moves straight and the destination square is empty
        if (endCol === startCol && board[endRow][endCol] === '') {
            // Checks if the move is exactly one square forward
            if (endRow === startRow + direction) {
                 // White pawn's initial position (startPos) is [6, 0] and 
                 // it moves to end position (endPos) [5, 0]
                return true
            }

            // Checks for an beginning double move
            if ((this.color === 'white' && startRow === 6) || (this.color === 'black' && startRow === 1)) {
                // Checks to make sure the move 2 spaces forward has an empty square
                if (endRow === startRow + 2 * direction && board[endRow - direction][endCol] === '') {
                    // Black pawn at [1, 4] moves to [3, 4]
                    // Black pawn's initial position [1, 4] and it moves to [3, 4]
                    return true
                }
            }
        }
        
        // Checks for diagonal capture
        // Checks the positon ([1, 1] || [1, -1]) || ([-1, -1] || [-1, 1])
        if ((endCol - startCol === 1 || -1) && startRow + direction === endRow) {
            const targetPiece = board[endRow][endCol]

            if (targetPiece && targetPiece.color !== this.color) {
                return true
            }
        }

        // If none of the moves are valid return false
        return false
    }
}


export { Piece, Pawn }