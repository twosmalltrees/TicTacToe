//  Structuring the board:
//      j=0        j=1        j=2
// [[undefined, undefined, undefined],  i = 0
//  [undefined, undefined, undefined],  i = 1
//  [undefined, undefined, undefined]], i = 2
//
//  Winning lines:
// i[0]j[0] + i[0]j[1] + i[0]j[2] * First Row
// i[1]j[0] + i[1]j[1] + i[1]j[2] * Second Row
// i[2]j[0] + i[2]j[1] + i[2]j[2] * Third Row
//
// i[0]j[0] + i[1]j[0] + i[2]j[0] * First Column
// i[0]j[1] + i[1]j[1] + i[2]j[1] * Second Column
// i[0]j[2] + i[1]j[2] + i[2]j[2] * Third Column
//
// i[0]j[0] + i[1]j[1] + i[2]j[2] * First Diagonal
// i[0]j[2] + i[1]j[1] + i[2]j[0] * Second Diagonal


GameLogic = {
  // Gameplay Logic
  // Required functions:
  // -> checkIfWinner()
  //    Probably easiest to just manually check all possible winning lines...
  board: [],
  currentPlayer: 1,
  winCells: [],
  initializeBoardState: function(dimension) {
    // Sets up board.
    for (var y = 0; y < dimension; y++) {
      this.board.push([]);
      for (var x = 0; x < dimension; x++) {
        this.board[y].push(GameUI.makeCell(x,y));
      }
    }
  },

  moveRequest: function(cell) {
    var xPosition = cell.x_dimension;
    var yPosition = cell.y_dimension;
    // Check if move acceptable,
    if (this.getCellValue(xPosition, yPosition) === null ) {
      this.setCellValue(xPosition, yPosition);
      GameUI.markBoard(this.currentPlayer, cell);
      if (this.checkIfWinner()) {
        GameUI.endGame();
      } else {
        this.currentPlayer *= -1;
        GameUI.updatePlayerTurn(GameLogic.currentPlayer);
      }
    } else {
      return false;
    }
  },

  getCellValue: function(xPosition, yPosition) {
    return this.board[yPosition][xPosition].value;
  },

  setCellValue: function(xPosition, yPosition) {
    this.board[yPosition][xPosition].value = this.currentPlayer;
  },

  checkIfWinner: function() {
    if (this.checkRows() || this.checkColumns() || this.checkDiagonals()) {
      return true;
    } else {
      return false;
    }
  },

  checkRows: function() {
    // Needs to check rows and if it finds a winning combination, return an array of index pairs.
    for (var y = 0; y < this.board.length; y++) {
      var currentRow = [];
      var isWinningRow = true;
      for (var x = 0; x < this.board.length; x++) {
        if (this.board[y][x].value !== this.currentPlayer) {
          isWinningRow = false;
        }
        currentRow.push(this.board[y][x]);
      }
      if (isWinningRow === true) {
        this.winCells = currentRow;
        return true;
      }
    }
  },

  checkColumns: function() {
    for (var x = 0; x < this.board.length; x++) {
      var currentCol = [];
      var isWinningCol = true;
      for (var y = 0; y < this.board.length; y++) {
        if (this.board[y][x].value !== this.currentPlayer) {
          isWinningCol = false;
        }
        currentCol.push(this.board[y][x]);
      }
      if (isWinningCol === true) {
        this.winCells = currentCol;
        return true;
      }
    }
    return false;
  },

  checkDiagonals: function() {
    // Test first diagonal
    var isWinningDiagonal = true;
    for (var i = 0; i < this.board.length; i++) {
      testedCells = [];
      if (this.board[i][i].value !== this.currentPlayer) {
        isWinningDiagonal = false;
        console.log(isWinningDiagonal);
      }
      testedCells.push(this.board[i][i]);
    }
    if (isWinningDiagonal === true) {
      this.winCells = testedCells;
      return true;
    }
    // Test second diagonal
    isWinningDiagonal = true;
    for (var j = 0; j < this.board.length; j++) {
      testedCells = [];
      if (this.board[j][this.board.length - (j+1)].value !== this.currentPlayer) {
        isWinningDiagonal = false;
      }
      testedCells.push(this.board[j][this.board.length - (j+1)]);
    }
    if (isWinningDiagonal === true) {
      this.winCells = testedCells;
      return true;
    }
    // If no true value returned yet, return false.
    return false;
  }
};

GameUI = {
  // UI rendering
  renderBoard: function(board) {
    // Render this board to screen

    // Figure out required cell dimensions...
    // 400 px is board size. Overall cells should take up  95%.
    // So totalCellsWidth = 400 * 95/100.
    // Individual cell width = totalCellsWidth/board.length
    $board = $('<div>');
    $board.addClass('board');
    $board.append("<div class='board_border'></div>");
    var cellDimension = (400*93/100)/board.length;
    $('.container').append($board);
    for (var y = 0; y < board.length; y++) {
      var $row = $('<div>');
      $row.addClass('board_row');
      for (var x = 0; x < board.length; x++) {
        $row.append(GameLogic.board[y][x].$cell);
      }
      $board.append($row);
    }
    $('.cell').css({
      'max-width': cellDimension + 'px',
      'max-height': cellDimension + 'px'
    });
    $('.board_row').css({
      'max-height': cellDimension + 'px'
    });
  },
  makeCell: function(x, y) {
    var Cell = {
      x_dimension: x,
      y_dimension: y,
      value: null,
      $cell: $('<div>')
    };
    Cell.$cell.addClass('cell clickable player_one_hover');
    this.addCellClickHandler(Cell);
    return Cell;
  },

  addCellClickHandler: function(cell) {
    cell.$cell.on('click', function() {
      GameLogic.moveRequest(cell);
    });
  },

  markBoard: function(player, cell) { // Takes a player and a cell object.
    if (player === 1) {
      cell.$cell.removeClass('clickable player_one_hover player_two_hover').addClass('player_one_mark');
    } else if (player === -1) {
      cell.$cell.removeClass('clickable player_one_hover player_two_hover').addClass('player_two_mark');
    }
  },

  updatePlayerTurn: function(player) {
    if (player === 1) {
      $('.cell.clickable').removeClass('player_two_hover').addClass('player_one_hover');
    } else if (player === -1) {
      $('.cell.clickable').removeClass('player_one_hover').addClass('player_two_hover');
    }
  },

  endGame: function() {
    $('.cell').removeClass('clickable player_one_hover player_two_hover');
    $('div.cell').off('click');
  }
};


$(document).ready(function(){
  GameLogic.initializeBoardState(5);
  GameUI.renderBoard(GameLogic.board);
});
