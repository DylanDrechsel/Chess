import { Pawn, Rook, Knight, Bishop, Queen, King } from './pieces.js'

class ChessBoard {
    constructor() {
        this.board = [
            [new Rook('black'), new Knight('black'), new Bishop('black'), new Queen('black'), new King('black'), new Bishop('black'), new Knight('black'), new Rook('block')],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            [new Rook('white'), new Knight('white'), new Bishop('white'), new Queen('white'), new King('white'), new Bishop('white'), new Knight('white'), new Rook('white')]
        ]
        this.selectedPiece = null
        this.currentTurn = 'white'
        this.renderBoard()
        this.addEventListeners()
    }

    // Renders the chess board in the HTML element with id 'chessboard'
    renderBoard = () => {
        const boardElement = document.getElementById('chessboard')

        // Clear previous board content to avoid duplicate renders
        boardElement.innerHTML = ''

        // Loop through each row of the board
        for (let row = 0; row < 8; row++) {
            // Loop through each column of the board
            for (let col = 0; col < 8; col++) {
                // Create a new div element for the square
                const square = document.createElement('div')
                const piece = this.board[row][col]

                // setting square color based on remainder 
                square.className = `square ${((row + col) % 2 ===0) ? 'white' : 'black'}`

                // Set Dataset (row & col) to hold the position of the square
                // Example: Top Left Square --> Row: 0 / Col: 0 
                square.dataset.row = row
                square.dataset.col = col

                if (piece) {
                    square.innerHTML = this.getPieceSymbol(piece)
                }
                
                boardElement.appendChild(square)
            }
        }
    }

    addEventListeners = () => {
        const squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            // Bind 'this' to the current class instance for the event handler
            square.addEventListener('click', this.handleSquareClick.bind(this))
        })
    }

    handleSquareClick = (event) => {
        // Gets the Row and Column indices from the clicked sqaures data attributes
        // That were set in the renderBoard function
        const row = parseInt(event.target.dataset.row) // Gets the row index
        const col = parseInt(event.target.dataset.col) // Gets the column index

        // Get the piece that is located at the clicked square
        const piece = this.board[row][col]

        // Check if there's a currently selected piece
        if (this.selectedPiece) {
            const { row: startRow, col: startCol } = this.selectedPiece
            const selectedPiece = this.board[startRow][startCol]

            // Check if the move is valid for the selected piece
            if (selectedPiece.isValidMove([startRow, startCol], [row, col], this.board)) {
                // Move the selected piece to the new position
                this.movePiece(row, col)
                return // Exit early if a valid move is performed
            }
        }

        // Select a piece if it's the current player's turn and no piece is currently selected
        if (piece && piece.color === this.currentTurn) {
            this.selectPiece(row, col)
        }
    }

    // Function to select a piece on the board
    selectPiece = (row, col) => {
        // Store the selected piece's position in an object
        this.selectedPiece = { row, col }

         // Get all squares on the board to remove previous selections
        const squares = document.querySelectorAll('.square')

        // Iterate through each square element to remove the 'selected' class
        squares.forEach(square => square.classList.remove('selected'))

        // Find the specific square that corresponds to the currently selected pieces position
        const selectedSquare = document.querySelector(`.square[data-row='${row}'][data-col='${col}']`)

        // Add the 'selected' class to highlight the selected square
        selectedSquare.classList.add('selected')
    }

    // Function to move a piece from its selected position to a new position
    movePiece = (row, col) => {
        // Deconstruct the selected pieces starting position
        const { row: startRow, col: startCol} = this.selectedPiece
        const piece = this.board[startRow][startCol]

        // Check if the move is valid for the selected piece
        if (piece.isValidMove([startRow, startCol], [row, col], this.board)) {
            // Move the selected piece to the new position on the board
            // Update the destination square with the piece
            this.board[row][col] = this.board[startRow][startCol]

            // Clear the starting position to indicate the piece has moved
            // Set the original position to an empty string
            this.board[startRow][startCol] = ''

            // Deselect the piece by setting the selectedPiece to null
            // This indicates that no piece is currently selected
            this.selectedPiece = null

            // Re-render the chessboard to update the position of the pieces
            this.renderBoard()

            // Reset the event listeners
            this.addEventListeners()

            // Check of the move puts the opponents King in check or checkmate
            const opponentColor = this.currentTurn === 'white' ? 'black' : 'white'
            if (this.isCheckmate(opponentColor)) {
                alert(`${this.currentTurn} wins by checkmate!`)
                this.endGame()
                return  // Exit the function if checkmate is detected
            }
    
            // Check if the opponent is in check (but not checkmate)
            if (this.isCheck(opponentColor)) {
                alert(`${opponentColor} is in check!`)
            }

            // Switch the turn to the other player
            this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white'

        } else if (this.board[row][col] && this.board[row][col].color === this.currentTurn) {
            // Select a different piece of the same color
            this.selectPiece(row, col)
        } else {
            alert('Invalid move!')
        }
    }

    // Checks if the king of specified color is in check
    isCheck = (color) => {
        // Find the position of the King for the specified color
        let kingPosition

        // Gets the Kings position for the color
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col]

                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPosition = [row, col]
                    break
                }
            }

            if (kingPosition) break
        }

        // If no king was found for the color throw error
        if (!kingPosition) {
            console.error(`No king was found for color: ${color}`)
            return false
        }

        // Check if any opponents piece can move to the Kings position
        const [kingRow, kingCol] = kingPosition
        const opponentColor = color === 'white' ? 'black' : 'white'

        // Iterate over all squares on the board to find the opponents pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Stores piece information
                const piece = this.board[row][col]

                if (piece && piece.color === opponentColor) {
                    // If an opponents piece can move to the Kings position
                    // The King is in check
                    if (piece.isValidMove([row, col], [kingRow, kingCol], this.board)) {
                        return true
                    }
                }
            }
        }

        // If no opponents piece can attack the Kings potision 
        // The King is not in check 
        return false
    }

    // Checks if the king of the specified color is in checkmate
    isCheckmate(color) {
        // First, check if the king is in check
        if (!this.isCheck(color)) {
            return false // If the king is not in check, it can't be checkmate
        }
    
        // Find the king's position on the board
        let kingPosition
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col]
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPosition = [row, col]
                    break
                }
            }
            if (kingPosition) break
        }
    
        // If no king is found, log an error and return false
        if (!kingPosition) {
            console.error(`No king found for color: ${color}`)
            return false
        }
    
        const [kingRow, kingCol] = kingPosition
        const king = this.board[kingRow][kingCol]
    
        // Define all possible moves for the king (8 directions)
        const possibleMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ]
    
        // Check each possible move for the king
        for (const [dx, dy] of possibleMoves) {
            const newRow = kingRow + dx
            const newCol = kingCol + dy
    
            // Check if the new position is on the board
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                // Check if the move is valid for the king
                if (king.isValidMove([kingRow, kingCol], [newRow, newCol], this.board)) {
                    // Simulate the move on a temporary board
                    const tempBoard = this.board.map(row => row.slice())
                    tempBoard[newRow][newCol] = king
                    tempBoard[kingRow][kingCol] = ''
    
                    // Check if this move gets the king out of check
                    if (!this.isPositionUnderAttack([newRow, newCol], color, tempBoard)) {
                        return false // Found a safe move, not checkmate
                    }
                }
            }
        }
    
        // If no safe moves for the king, check if any other piece can block or capture
        return !this.canAnyPieceBlockOrCapture(color)
    }
    
    isPositionUnderAttack(position, defendingColor, board) {
        const [row, col] = position
        const attackingColor = defendingColor === 'white' ? 'black' : 'white'
    
        // Check all squares on the board
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c]
                // If an opposing piece is found
                if (piece && piece.color === attackingColor) {
                    // Check if it can attack the given position
                    if (piece.isValidMove([r, c], [row, col], board)) {
                        return true // Position is under attack
                    }
                }
            }
        }
        return false // Position is not under attack
    }
    
    canAnyPieceBlockOrCapture(defendingColor) {
        // Check all squares on the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col]
                // If a defending piece (not the king) is found
                if (piece && piece.color === defendingColor && piece.type !== 'king') {
                    // Check all possible move destinations for this piece
                    for (let r = 0; r < 8; r++) {
                        for (let c = 0; c < 8; c++) {
                            if (piece.isValidMove([row, col], [r, c], this.board)) {
                                // Simulate the move on a temporary board
                                const tempBoard = this.board.map(row => row.slice())
                                tempBoard[r][c] = piece
                                tempBoard[row][col] = ''
    
                                // If this move gets the king out of check, it's not checkmate
                                if (!this.isCheck(defendingColor, tempBoard)) {
                                    return true // Found a move that blocks the check or captures the attacking piece
                                }
                            }
                        }
                    }
                }
            }
        }
        return false // No piece can block or capture to prevent checkmate
    }
    
    // Helper function to check if the king is still in check after a simulated move
    isCheckAfterMove(color, board) {
        let kingPosition
    
        // Find the king's position on the simulated board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col]
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPosition = [row, col]
                    break
                }
            }
    
            if (kingPosition) break
        }
    
        if (!kingPosition) {
            console.error(`No king found for color: ${color}`)
            return true // If there's no king, assume it's in check (shouldn't happen)
        }
    
        const [kingRow, kingCol] = kingPosition
        const opponentColor = color === 'white' ? 'black' : 'white'
    
        // Check if any opponent piece can move to the king's position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col]
                if (piece && piece.color === opponentColor) {
                    if (piece.isValidMove([row, col], [kingRow, kingCol], board)) {
                        return true // The king is still in check
                    }
                }
            }
        }
    
        return false // The king is not in check
    }
    

    // Get the symbol representing a piece
    getPieceSymbol = (piece) => {
        const symbols = {
            'pawn': piece.color === 'white' ? '♙' : '♟',
            'rook': piece.color === 'white' ? '♖' : '♜',
            'knight': piece.color === 'white' ? '♘' : '♞',
            'bishop': piece.color === 'white' ? '♗' : '♝',
            'queen': piece.color === 'white' ? '♕' : '♛',
            'king': piece.color === 'white' ? '♔' : '♚'
        }
        return symbols[piece.type]
    }

    // Function to end the game and disable further moves
    endGame = () => {
        const squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            square.removeEventListener('click', this.handleSquareClick) // Remove event listeners
        })
    }
}

const chessBoard = new ChessBoard()