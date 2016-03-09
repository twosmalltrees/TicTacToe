/////////////////////////////////////////////////////////////



ComputerPlayer = {
  boardStateKnowledge: [],
  currentGameHistory: [], // Arrays of boardState objects and possibleMove index of selected move.
  getComputerMove: function() {
    // Firstly test if there is anything inside boardStateKnowledge, if not, add a boardState for the current games set up
    if (this.boardStateKnowledge.length === 0) {
      this.boardStateKnowledge.push(this.createBoardState());
    }
    // First, create a local copy of the current board values in currentPositions:
    var currentPositions = [];

    for (var i = 0; i < GameState.board.length; i++) {
      var positionsRow = [];
      for (var m = 0; m < GameState.board.length; m++) {
        positionsRow.push(GameState.board[i][m].value);
      }
      currentPositions.push(positionsRow);
    }
    // Then need to search through the existing boardStates inside boardStateKnowledge, and check if any of them match currentPositions. If not, push it up to boardStateKnowledge...
    var matchedBoardState;
    var matchFound = false;
    for (var j = 0; j < this.boardStateKnowledge.length; j++) {
      var knownPosition = this.boardStateKnowledge[j].positions;
      if (this.matchBoardStates(currentPositions, knownPosition)) {
        matchFound = true;
        matchedBoardState = this.boardStateKnowledge[j];
      }
    }
    // If matchFound has not located anything, create new boardState and assign to matchedBoardState
    if (matchFound === false) {
      matchedBoardState = this.createBoardState();
      this.boardStateKnowledge.push(matchedBoardState); // Pushes new boardState.
    }
    // Loop through the boardState.moveScores, and find the lowest score.
    var bestMoveScore = matchedBoardState.move_scores[0];
    var bestMoveIndex = 0;
    var bestMoveFound = false;
    for (var k = 0; k < matchedBoardState.move_scores.length; k++) {
      if (matchedBoardState.move_scores[k] > bestMoveScore) {
        bestMoveIndex = k;
        bestMoveFound = true;
        console.log("Best Move Found");
      }
    }

    if (bestMoveFound === false) {
      bestMoveIndex = Math.floor(Math.random() * (matchedBoardState.move_scores.length - 1));
    }

     // Best move index now usable...
    // Returns the pair of indicies that represent the desired best move...
    var bestMove = matchedBoardState.possible_moves[bestMoveIndex];

    // Then search the GameState.board to find the matching cell, and pass this through to move request...

    var $bestMoveCell = GameState.board[bestMove[0]][bestMove[1]];

    // Push up the info on boardState at this point and chosen move to the game history.
    this.currentGameHistory.push([matchedBoardState, bestMoveIndex]);

    // REQUEST THE MOVE
    GameState.moveRequest($bestMoveCell);
  },
  updateMoveScores: function(result) {
    // Assign different scores based on result
    var score;
    if (result === "win") {
      score = 0.3;
    } else if (result === "draw") {
      score = 0.05;
    } else if (result === "loss") {
      score = -0.2;
    }

    // Loop backwards through the history, adjusting moveScores.
    for (var i = (this.currentGameHistory.length - 1); i >= 0; i--) {
      var moveScoreIndex = this.currentGameHistory[i][1];
      this.currentGameHistory[i][0].move_scores[moveScoreIndex] += score;
    }
    // FOR EACH MOVE, CHECK IF THE SELECTED MOVE STOPPED A HUMAN PLAYER WIN.
    // YEAH...

    this.currentGameHistory = [];
  },
  createBoardState: function() {
    // Create an array that mirrors the current board positions.
    var currentPositions = [];

    for (var i = 0; i < GameState.board.length; i++) {
      var positionsRow = [];
      for (var m = 0; m < GameState.board.length; m++) {
        positionsRow.push(GameState.board[i][m].value);
      }
      currentPositions.push(positionsRow);
    }

    // Provide array of indexes of all cells that are available to move on given the currentPositions
    var possibleMoves = [];

    for (var j = 0; j < currentPositions.length; j++) {
      for (var k = 0; k < currentPositions.length; k++) {
        if (currentPositions[j][k] === null) {
          possibleMoves.push([j, k]);
        }
      }
    }

    // Initialize array of scores of appropriate length, all zero.
    var moveScores = Array(possibleMoves.length).fill(0);

    boardState = {
      positions: currentPositions,
      possible_moves: possibleMoves,
      move_scores: moveScores
    };

    return boardState;
  },

  matchBoardStates: function(board_one, board_two) {
    // Given two boards layouts, determines if they are the same.
    if (board_one && board_two) {
      var boardsEqual = true;
      for (var i = 0; i < board_one.length; i++) {
        for (var j = 0; j < board_one.length; j++) {
          if (board_one[i][j] !== board_two[i][j]) {
            boardsEqual = false;
          }
        }
      }
      return boardsEqual;
    }
  },

  trainComputer: function(iterations) {
    for (var i = 0; i <= iterations; i++) {
      //GameState.resetGame();
      //while(GameState.isGameOver() === false) {
        var possibleMiscMoves = [];
        for (var j = 0; j < GameState.board.length; j++) {
          for (var k = 0; k < GameState.board.length; k++) {
            if (GameState.board[j][k].value === null) {
              possibleMiscMoves.push(GameState.board[j][k]);
            }
          }
        }

        if (GameState.currentPlayer === 1) {
          GameState.moveRequest(possibleMiscMoves[Math.floor(Math.random() * possibleMiscMoves.length)]);
        } else {
          ComputerPlayer.getComputerMove();
        }



        console.log("CURRENT ITERATIONS: " + i);
      //}
    }
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
    this.initializeBoardState (this.boardSize);
    GameUI.resetBoard();
  },

  alertComputerOfResult: function(winner) {
    var result;
    if (winner === -1) {
      result = "win";
    } else if (winner === 1) {
      result = "loss";
    } else if (winner === 0) {
      result = "draw";
    }
    ComputerPlayer.updateMoveScores(result);
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
        GameState.alertComputerOfResult(this.currentPlayer);
        if (this.currentPlayer === 1) {
          this.playerOneWins ++;
        } else if (this.currentPlayer === -1) {
          this.playerTwoWins ++;
        }
        return true;
    } else if (this.movesTaken === (this.board.length * this.board.length)) {
        GameState.alertComputerOfResult(0); // 0 is input if draw...
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
    $('.x3').on('click', function(){
      $('.board_dimension').removeClass('selected');
      GameState.boardSize = 3;
      GameState.resetGame();
      $(this).addClass('selected');
    });
    $('.x4').on('click', function(){
      $('.board_dimension').removeClass('selected');
      GameState.boardSize = 4;
      GameState.resetGame();
      $(this).addClass('selected');
    });
    $('.x5').on('click', function(){
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
