import { Pawn } from './pieces.js'

// Lowercase --> Black Pieces
// Uppercase --> White Pieces
class ChessBoard {
    constructor() {
        this.board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]
        this.selectedPiece = null
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
                
                boardElement.appendChild(square);
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

        // Check if the piece is currently selected
        this.selectedPiece ? this.movePiece(row, col) : null
        piece ? this.selectPiece(row,col) : null
    }

    // Function to select a piece on the board
    selectPiece = (row, col) => {
        // Store the selected piece's position in an object
        this.selectedPiece = { row, col }
    }

    // Function to move a piece from its selected position to a new position
    movePiece = (row, col) => {
        // Deconstruct the selected pieces starting position
        const { row: startRow, col: startCol} = this.selectedPiece

        // Move the selected piece to the new position on the baord
        // Place the piece at the destination (row, col)
        this.board[row][col] = this.board[startRow][startCol]

        // Clear the starting position to indicate the piece has moved
        this.board[startRow][startCol] = ''

        // Reset the selectedPiece to null, indicating no piece is currently selected
        this.selectedPiece = null
        
        // Re-render the chessboard to update the position of the pieces
        this.renderBoard()

        // Reset the Event Listeners
        this.addEventListeners()
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
        return symbols[piece.type];
    }
}

const chessBoard = new ChessBoard()