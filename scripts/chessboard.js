// Lowercase --> Black Pieces
// Uppercase --> White Pieces
class ChessBoard {
    constructor() {
        this.board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]
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
                console.log(piece)

                // setting square color based on remainder 
                square.className = `square ${((row + col) % 2 ===0) ? 'white' : 'black'}`
                square.dataset.row = row
                square.dataset.col = col

                if (piece) {
                    square.innerHTML = this.getPieceSymbol(piece)
                }
                
                boardElement.appendChild(square);
            }
        }
    }

    getPieceSymbol(piece) {
        const symbols = {
            'p': '♟',
            'r': '♜',
            'n': '♞',
            'b': '♝',
            'q': '♛',
            'k': '♚',
            'P': '♙',
            'R': '♖',
            'N': '♘',
            'B': '♗',
            'Q': '♕',
            'K': '♔'
        }
        return symbols[piece]
    }
}

const chessBoard = new ChessBoard()
chessBoard.renderBoard()