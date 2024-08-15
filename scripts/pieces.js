// Main class for pieces
// This logic will be the same for all pieces
class Piece {
    constructor(color, type) {
        // Determines white or black piece
        this.color = color

        // pawn, rook, knight, bishop, queen, king
        this.type = type
    }

    isValidMove = (startPos, endPos, board) => {
        return false
    }
}

// Pawn piece with movement logic
class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn');
    }

    isValidMove = (startPos, endPos, board) => {
        // Pawn Examle --> 
        // startPos --> [6, 0] 
        // endPos --> [5, 0]
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
            // Grabs to target piece
            const targetPiece = board[endRow][endCol]

            // Checks if ther eis a piece there that belongs to the opposing color
            if (targetPiece && targetPiece.color !== this.color) {
                // White pawn at [4, 4] captures a black piece at [3, 5]
                // White pawn moves from [4, 4] to [3, 5] (one square diagonal)
                return true
            }
        }

        // If none of the moves are valid return false
        return false
    }
}

// Rook piece with movement logic
class Rook extends Piece {
    constructor(color) {
        super(color, 'rook');
    }

    // Check if a rook move is valid
    isValidMove = (startPos, endPos, board) => {
        // Rook Examle --> 
        // startPos --> [0, 0] 
        // endPos --> [5, 0]

        // Starting and ending positions for rows and columns
        const startRow = startPos[0]
        const startCol = startPos[1]
        const endRow = endPos[0]
        const endCol = endPos[1]

        // Rook must move in a straight line, either long the same row || column
        if (startCol !== endCol && startRow !== endRow ) {
            return false
        }

        // Determine the direction of movement (row and column step increments)
        // The `stepRow` variable determines how many steps to take vertically (up or down)
        // The `stepCol` variable determines how many steps to take horizontally (left or right)
        const stepRow = startRow === endRow ? 0 : (endRow > startRow ? 1 : -1)
        const stepCol = startCol === endCol ? 0 : (endCol > startCol ? 1 : -1)

        // Check each square between the start and end positions for other pieces
        let currentRow = startRow + stepRow; // Initialize current row
        let currentCol = startCol + stepCol; // Initialize current column

        // Loop through each square between the starting and ending positions to check for other pieces
        while (currentRow !== endRow || currentCol !== endCol) {
            // Checks if the current square is occupied
            if (board[currentRow][currentCol] !== '') {
                // If there is a piece blocking the path, the move is invalid
                return false
            }
            currentRow += stepRow
            currentCol += stepCol
        }

        // Checks the destination square for the same color piece
        const targetPiece = board[endRow][endCol]

        // Cant jump own piece
        if (targetPiece && targetPiece.color === this.color) {
            return false
        }

        return true
    }
}

class Knight extends Piece {
    constructor(color) {
        super(color, 'knight')
    }
}

class Bishop extends Piece {
    constructor(color) {
        super(color, 'bishop')
    }
}

class Queen extends Piece {
    constructor(color) {
        super(color, 'queen')
    }
}

class King extends Piece {
    constructor(color) {
        super(color, 'king')
    }
}

export { Piece, Pawn, Rook, Knight, Bishop, Queen, King }