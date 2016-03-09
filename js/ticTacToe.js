ComputerPlayer = {
  playStrategy: "",
  getComputerMove: function() {
    var rows = GameState.board;
    var columns = this.getColumns();
    var diagonals = this.getDiagonals();
    console.log("DIAGONALS ARRRRRRE:")
    console.log(diagonals);

    // FIRSTLY, ALWAYS CHECK IF THE COMPUTER HAS WINNING MOVE OPTION. IF SO, TAKE IT:
    if (this.checkForWinningMove(rows, "computer") !== false) {
      GameState.moveRequest(this.checkForWinningMove(rows, "computer"));
      return;
    } else if (this.checkForWinningMove(columns, "computer") !== false) {
      GameState.moveRequest(this.checkForWinningMove(columns, "computer"));
      return;
    } else if (this.checkForWinningMove(diagonals, "computer") !== false) {
      GameState.moveRequest(this.checkForWinningMove(diagonals, "computer"));
      return;
    }

    // ON FIRST COMPUTER MOVE, CHECK HUMAN PLAYERS FIRST MOVE AND SET STRATEGY ACCORDINGLY
    if (GameState.movesTaken === 1) {
      if (GameState.board[1][1].value === 1) {
        this.playStrategy = "tookCenter";
        console.log("human took center");
        GameState.moveRequest(GameState.board[0][0]);
        return;
      } else if (GameState.board[0][0].value === 1 || GameState.board[0][2].value === 1 || GameState.board[2][0].value === 1 || GameState.board[2][2].value === 1) {
        this.playStrategy = "tookCorner";
        console.log("Took Corner");
        GameState.moveRequest(GameState.board[1][1]);
        return;
      } else {
        this.playStrategy = "tookMidSide";
        GameState.moveRequest(GameState.board[1][1]);
        return;
      }
    }
    // SECOND COMPUTER MOVE, COMPUTER NOW CHECKS TO SEE IF HUMAN HAS ANY WIN POSSIBILITIES.
    if (this.checkForWinningMove(rows, "human") !== false) {
      GameState.moveRequest(this.checkForWinningMove(rows, "human"));
      console.log('CHECKED RZOWS FOR HUMAN WIN');
      return;
    } else if (this.checkForWinningMove(columns, "human") !== false) {
      GameState.moveRequest(this.checkForWinningMove(columns, "human"));
      console.log('CHECKED COLUMNS FOR HUMAN WIN');
      return;
    } else if (this.checkForWinningMove(diagonals, "human") !== false) {
      console.log('CHECKED DIAGONALS FOR HUMAN WIN');
      GameState.moveRequest(this.checkForWinningMove(diagonals, "human"));
      return;
    }
    // IF NO WIN HUMAN WIN POSSIBILITIES LOCATED ABOVE, CONTINUES WITH THIS
    console.log("Current STRATEGY is " + ComputerPlayer.playStrategy);
    console.log("moves taken is" + GameState.movesTaken);
    if (GameState.movesTaken === 3) {
      if (this.playStrategy === "tookCorner") {
        if (GameState.board[0][1].value === null) {
          GameState.moveRequest(GameState.board[0][1]);
          return;
        } else {
          GameState.moveRequest(GameState.board[2][1]);
          return;
        }
      } else if (this.playStrategy === "tookMidSide") {
        if (arraySum(rows[0]) + arraySum(columns[0]) === 2) {
          GameState.moveRequest(GameState.board[0][0]);
          return;
        } else if (arraySum(rows[0]) + arraySum(columns[2]) === 2) {
          GameState.moveRequest(GameState.board[0][2]);
          return;
        } else if (arraySum(rows[2]) + arraySum(columns[0]) === 2) {
          GameState.moveRequest(GameState.board[2][0]);
          return;
        } else if (arraySum(rows[2]) + arraySum(columns[2]) === 2) {
          GameState.moveRequest(GameState.board[2][2]);
          return;
        }
      }
    }
  },
  getColumns: function() {
    var cols = [];
    for (var i = 0; i < GameState.board.length; i++) {
      var colToPush = [];
      for (var k = 0; k < GameState.board.length; k++) {
        colToPush.push(GameState.board[k][i]);
      }
      cols.push(colToPush);
    }
    return cols;
  },
  getDiagonals: function() {
    var diagonals = [];
    var diagonalToPush = [];
    for (var i = 0; i < GameState.board.length; i++) {
      diagonalToPush.push(GameState.board[i][i]);
    }
    diagonals.push(diagonalToPush);

    diagonalToPush = [];
    for (var j = 0; j < GameState.board.length; j++) {
      diagonalToPush.push(GameState.board[j][(GameState.board.length - 1) - j]);
    }
    diagonals.push(diagonalToPush);
    return diagonals;
  },

  // ?????? THE PROBLEM IS HERE!!!!!! ITS RETURNING UNDEFINED.

  checkForWinningMove: function(array, player) {
    console.log("Check winning move was called");
    if (player === "human") {
      for (var i = 0; i < array.length; i++) {
        console.log("ARRAY SUM THINGS IS>>>");
        console.log(this.arraySum(array[i]));
        var humanWinIndex;
        if (this.arraySum(array[i]) === 2) {
          console.log("Inner loops ran");
          for (var k = 0; k < array[i].length; k++) {
            if (array[i][k].value === null) {
              humanWinIndex = k;
              return array[i][humanWinIndex];
            }
          }
          console.log("Human win index is: " + humanWinIndex);
          console.log("Human has win option");
          console.log(array[i][humanWinIndex]);

        }
      }
    } else if (player === "computer") {
      console.log("Computer branch ran");
      for (var j = 0; j < array.length; j++) {
        console.log("Array sum is:");
        console.log(this.arraySum(array[j]));
        var computerWinIndex = 0;
        console.log("ARRAY j IS:::::");
        console.log(array[j]);
        if (this.arraySum(array[j]) === -2) {
          for (var m = 0; m < array[j].length; m++) {
            if (array[j][m].value === null) {
              console.log("Array jm value is");
              console.log(array[j][m].value);
              computerWinIndex = m;
              return array[j][computerWinIndex];
            }
            console.log("Computer has win option");
            console.log(array[j]);
            console.log("computer win option is " + computerWinIndex);
            console.log(array[j][computerWinIndex]);
          }
        }
      }
    }
    console.log("returning false");
    return false;
  },
  arraySum: function(array) {
    var values = [];
    for (var i = 0; i < array.length; i++) {
      values.push(array[i].value);
    }
    var sum = values.reduce(function(a, b) {
      return a + b;
    });
    if (sum === undefined) {
      sum = 0;
    }
    return sum;
  }

};



////////////////////////////////////////////////////////////////////////////////////////////////////
//  GAME STATEGAME STATEGAME STATEGAME STATEGAME STATEGAME STATEGAME STATEGAME STATEGAME STATE////



GameState = {
  board: [],
  opponent: "human",
  boardSize: 3,
  currentPlayer: 1,
  winCells: [],
  movesTaken: 0,
  playerOneWins: 0,
  playerTwoWins: 0,
  resetGame: function() {
    this.board = [];
    this.currentPlayer = 1;
    this.winCells = [];
    this.movesTaken = 0;
    this.initializeBoardState(this.boardSize);
    GameUI.resetBoard();
  },
  initializeBoardState: function(dimension) {
    // Sets up board.
    for (var y = 0; y < dimension; y++) {
      this.board.push([]);
      for (var x = 0; x < dimension; x++) {
        this.board[y].push(GameUI.makeCell(x, y));
      }
    }
  },

  moveRequest: function(cell) {
    console.log("move request was made");
    console.log(cell);
    var xPosition = cell.x_dimension;
    var yPosition = cell.y_dimension;
    // Check if move acceptable,
    if (this.getCellValue(xPosition, yPosition) === null) {
      this.setCellValue(xPosition, yPosition);
      GameUI.markBoard(this.currentPlayer, cell);
      this.movesTaken++;
      if (this.isGameOver()) {
        GameUI.endGame(this.currentPlayer, this.winCells);
        this.resetGame(this.boardSize);
      } else {
        this.currentPlayer *= -1;
        GameUI.updatePlayerTurn(GameState.currentPlayer);
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

  isGameOver: function() {
    if (this.checkRows() || this.checkColumns() || this.checkDiagonals()) {
      if (this.currentPlayer === 1) {
        this.playerOneWins++;
      } else if (this.currentPlayer === -1) {
        this.playerTwoWins++;
      }
      return true;
    } else if (this.movesTaken === (this.board.length * this.board.length)) {
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
      if (this.board[j][this.board.length - (j + 1)].value !== this.currentPlayer) {
        isWinningDiagonal = false;
      }
      testedCells.push(this.board[j][this.board.length - (j + 1)]);
    }
    if (isWinningDiagonal === true) {
      this.winCells = testedCells;
      return true;
    }
    // If no true value returned yet, return false.
    return false;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
///// UI RENDERING UI RENDERING UI RENDERING UI RENDERING UI RENDERING UI RENDERING UI RENDER//////

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
    var cellDimension = (400 * 93 / 100) / board.length;
    $('.board_container').append($board);
    for (var y = 0; y < board.length; y++) {
      var $row = $('<div>');
      $row.addClass('board_row');
      for (var x = 0; x < board.length; x++) {
        $row.append(GameState.board[y][x].$cell);
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
      GameState.moveRequest(cell);
    });
  },

  handleBoardSizeClick: function() {
    $('.x3').on('click', function() {
      $('.board_dimension').removeClass('selected');
      GameState.boardSize = 3;
      GameState.resetGame();
      $(this).addClass('selected');
    });
    $('.x4').on('click', function() {
      $('.board_dimension').removeClass('selected');
      GameState.boardSize = 4;
      GameState.resetGame();
      $(this).addClass('selected');
    });
    $('.x5').on('click', function() {
      $('.board_dimension').removeClass('selected');
      GameState.boardSize = 5;
      GameState.resetGame();
      $(this).addClass('selected');
    });
  },

  handleOpponentChangeClick: function() {
    $('.human').on('click', function() {
      $('.opponent').removeClass('selected');
      $(this).addClass('selected');
      GameState.opponent = "human";
      GameState.resetGame();
    });

    $('.computer').on('click', function() {
      $('.opponent').removeClass('selected');
      $(this).addClass('selected');
      GameState.opponent = "computer";
      GameState.resetGame();
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
    if (GameState.opponent === "human") {
      if (player === 1) {
        $('.cell.clickable').removeClass('player_two_hover').addClass('player_one_hover');
      } else if (player === -1) {
        $('.cell.clickable').removeClass('player_one_hover').addClass('player_two_hover');
      }
    } else if (GameState.opponent === "computer") {
      if (player === 1) {
        $('.cell.clickable').removeClass('player_two_hover').addClass('player_one_hover');
      } else if (player === -1) {
        $('.cell.clickable').removeClass('player_one_hover');
        ComputerPlayer.getComputerMove();
      }
    }
  },

  updatePlayerScores: function() {
    var playerOneScore = GameState.playerOneWins;
    var playerTwoScore = GameState.playerTwoWins;
    $(".player_one .player_score").text("Score: " + playerOneScore);
    $(".player_two .player_score").text("Score: " + playerTwoScore);
  },

  endGame: function(player, winningCells) {
    $('.cell').removeClass('clickable player_one_hover player_two_hover');
    $('div.cell').off('click');
    this.updatePlayerScores();
    this.resetBoard();
  },

  resetBoard: function() {
    $('.board_container').html("");
    GameUI.renderBoard(GameState.board);
  },


};

$(document).ready(function() {
  GameState.initializeBoardState(3);
  GameUI.handleBoardSizeClick();
  GameUI.handleOpponentChangeClick();
  GameUI.renderBoard(GameState.board);
});
