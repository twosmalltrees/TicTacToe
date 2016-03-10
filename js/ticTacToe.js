ComputerPlayer = {
  playStrategy: "",
  getComputerMove: function() {
    var rows = GameState.board;
    var columns = this.getColumns();
    var diagonals = this.getDiagonals();

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
        GameState.moveRequest(GameState.board[0][0]);
        return;
      } else if (GameState.board[0][0].value === 1 || GameState.board[0][2].value === 1 || GameState.board[2][0].value === 1 || GameState.board[2][2].value === 1) {
        this.playStrategy = "tookCorner";
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
      return;
    } else if (this.checkForWinningMove(columns, "human") !== false) {
      GameState.moveRequest(this.checkForWinningMove(columns, "human"));
      return;
    } else if (this.checkForWinningMove(diagonals, "human") !== false) {
      GameState.moveRequest(this.checkForWinningMove(diagonals, "human"));
      return;
    }
    // IF NO WIN HUMAN WIN POSSIBILITIES LOCATED ABOVE, CONTINUES WITH THIS
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
        if (this.arraySum(rows[0]) + this.arraySum(columns[0]) === 2) {
          GameState.moveRequest(GameState.board[0][0]);
          return;
        } else if (this.arraySum(rows[0]) + this.arraySum(columns[2]) === 2) {
          GameState.moveRequest(GameState.board[0][2]);
          return;
        } else if (this.arraySum(rows[2]) + this.arraySum(columns[0]) === 2) {
          GameState.moveRequest(GameState.board[2][0]);
          return;
        } else if (this.arraySum(rows[2]) + this.arraySum(columns[2]) === 2) {
          GameState.moveRequest(GameState.board[2][2]);
          return;
        }
      }
    }
    // FINALLY, IF NONE OF THE OTHER CONDITIONS ABOVE MET, CHOSE RANDOM MOVE.
    var possibleMoves = []; // Find all possible moves

    for (var i = 0; i < GameState.boardSize; i++){
      for (var j = 0; j < GameState.boardSize; j++){
        if (GameState.board[i][j].value === null) {
          possibleMoves.push(GameState.board[i][j]);
        }
      }
    }
    GameState.moveRequest(possibleMoves[Math.floor(Math.random() * (possibleMoves.length - 1))]);
    return;
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
    if (player === "human") {
      for (var i = 0; i < array.length; i++) {
        var humanWinIndex;
        if (this.arraySum(array[i]) === 2) {
          for (var k = 0; k < array[i].length; k++) {
            if (array[i][k].value === null) {
              humanWinIndex = k;
              return array[i][humanWinIndex];
            }
          }
        }
      }
    } else if (player === "computer") {
      for (var j = 0; j < array.length; j++) {
        var computerWinIndex = 0;
        if (this.arraySum(array[j]) === -2) {
          for (var m = 0; m < array[j].length; m++) {
            if (array[j][m].value === null) {
              computerWinIndex = m;
              return array[j][computerWinIndex];
            }
          }
        }
      }
    }
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
    var xPosition = cell.x_dimension;
    var yPosition = cell.y_dimension;
    // Check if move acceptable,
    if (this.board[yPosition][xPosition].value === null) {
      this.board[yPosition][xPosition].value = this.currentPlayer;
      GameUI.markBoard(this.currentPlayer, cell);
      this.movesTaken++;
      if (this.isGameOver()) {
        GameUI.endGame(this.currentPlayer, this.winCells);
      } else {
        this.currentPlayer *= -1;
        GameUI.updatePlayerTurn(GameState.currentPlayer);
      }
    } else {
      return false;
    }
  },

  isGameOver: function() {
    if (this.checkRows() || this.checkColumns() || this.checkDiagonals()) {
      if (this.currentPlayer === 1) {
        this.playerOneWins++;
        GameUI.showWin();
      } else if (this.currentPlayer === -1) {
        this.playerTwoWins++;
        GameUI.showWin();
      }
      return true;
    } else if (this.movesTaken === (this.board.length * this.board.length)) {
      GameUI.showDraw();
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


GameUI = {
  renderBoard: function(board) {
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

    Cell.$cell.on('click', function() {
      GameState.moveRequest(Cell);
    });

    return Cell;
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
    window.setTimeout(function() {
      GameState.resetGame();
    }, 2000);
  },

  resetBoard: function() {
    $('.board_container').css({'opacity': 0});
    setTimeout(function() {
      $('.board_container').html("");
      GameUI.renderBoard(GameState.board);
      $('.board_container').css({'opacity': 1});
    }, 400);
  },

  showWin: function() {
    if (GameState.currentPlayer === 1) {
      $('.player_one .result').html("<i class='fa fa-smile-o'></i>").css({'opacity': '1'});
      setTimeout(function(){
        $('.player_one .result').html("<i class='fa fa-smile-o'></i>").css({'opacity': '0'});
      }, 2000);
    }
    if (GameState.currentPlayer === -1) {
      $('.player_two .result').html("<i class='fa fa-smile-o'></i>").css({'opacity': '1'});
      setTimeout(function(){
        $('.player_two .result').html("<i class='fa fa-smile-o'></i>").css({'opacity': '0'});
      }, 2000);
    }
  },

  showDraw: function() {
    $('.result').html("<i class='fa fa-frown-o'></i>").css({'opacity': '1'});
    setTimeout(function(){
      $('.result').html("<i class='fa fa-frown-o'></i>").css({'opacity': '0'});
    }, 2000);
  }
};

$(document).ready(function() {
  GameState.initializeBoardState(3);
  GameUI.handleBoardSizeClick();
  GameUI.handleOpponentChangeClick();
  GameUI.renderBoard(GameState.board);
});
