import { Pawn, Rook, Knight, Bishop, Queen, King } from './pieces.js'

// Lowercase --> Black Pieces
// Uppercase --> White Pieces
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
            const { row: startRow, col: startCol } = this.selectedPiece;
            const selectedPiece = this.board[startRow][startCol];

            // Check if the move is valid for the selected piece
            if (selectedPiece.isValidMove([startRow, startCol], [row, col], this.board)) {
                // Move the selected piece to the new position
                this.movePiece(row, col);
                return; // Exit early if a valid move is performed
            }
        }

        // Select a piece if it's the current player's turn and no piece is currently selected
        if (piece && piece.color === this.currentTurn) {
            this.selectPiece(row, col);
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

            // Switch the turn to the other player
            this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white'

        } else if (this.board[row][col] && this.board[row][col].color === this.currentTurn) {
            // Select a different piece of the same color
            this.selectPiece(row, col)
        } else {
            alert('Invalid move!')
        }
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
        };
        return symbols[piece.type]
    }
}

const chessBoard = new ChessBoard()