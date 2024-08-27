const player = function (playerName, playerMarker) {
  const name = playerName;
  const getName = () => name;

  const marker = playerMarker;
  const getMarker = () => marker;

  let score = 0;
  const getScore = () => score;
  const addWin = () => (score += 1);
  const resetScore = () => (score = 0);

  return { getName, getMarker, addWin, getScore, resetScore };
};

const gameBoard = (function () {
  const grid = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = function () {
    grid.fill("");
  };

  const updateGrid = function (index, value) {
    grid[index] = value;
  };

  const checkWinner = function () {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return true;
      }
    }
  };

  const checkDraw = function () {
    return grid.every((cell) => {
      return cell !== "";
    });
  };

  const checkValidMove = function (index) {
    if (grid[index] === "") {
      return true;
    }
  };

  return {
    grid,
    updateGrid,
    checkWinner,
    checkDraw,
    checkValidMove,
    resetBoard,
  };
})();

const UIManager = function () {
  const mainWrapper = document.querySelector(".main-wrapper");
  const mainGrid = document.querySelector(".main-grid");
  const playerOneScore = document.querySelector(".player-one-score");
  const playerTwoScore = document.querySelector(".player-two-score");

  const getMainGrid = () => mainGrid;

  const updateUIGrid = function (div, marker) {
    div.textContent = marker;
    if (marker === "X") {
      div.classList.add("text-red-500");
      div.classList.remove("text-blue-500");
    } else if (marker === "O") {
      div.classList.add("text-blue-500");
      div.classList.remove("text-red-500");
    }
  };
  const resetUIBoard = function () {
    allDivs = document.querySelectorAll(".main-grid>div");
    for (let div of allDivs) {
      div.textContent = "";
    }
  };

  const showBoard = function () {
    if (mainWrapper.classList.contains("hidden")) {
      mainWrapper.classList.toggle("hidden");
    }
  };

  const updateScore = function (playerOne, playerTwo) {
    playerOneScore.textContent = `${playerOne.getName()} : ${playerOne.getScore()}`;
    playerTwoScore.textContent = `${playerTwo.getName()} : ${playerTwo.getScore()}`;
  };

  return {
    updateUIGrid,
    resetUIBoard,
    showBoard,
    getMainGrid,
    updateScore,
  };
};

const formManager = (function () {
  // start game modal/form
  const startGameModal = document.querySelector(".form-dialog");
  const showStartModal = () => startGameModal.showModal();
  const hideStartModal = () => startGameModal.close();

  const playerOneInput = document.querySelector("#player-one");
  const pLayerTwoInput = document.querySelector("#player-two");

  const getPlayerOneName = () => playerOneInput.value;
  const getPlayerTwoName = () => pLayerTwoInput.value;

  const resetInputs = function () {
    playerOneInput.value = "";
    pLayerTwoInput.value = "";
  };

  const submitButton = document.querySelector("#submit");
  const getSubmitButton = () => submitButton;

  // end game modal
  const endGameModal = document.querySelector(".new-game-dialog");
  const winningPlayerDiv = document.querySelector(".winning-player");
  const getWinningPlayerDiv = () => winningPlayerDiv;

  const showEndModal = () => endGameModal.showModal();
  const hideEndModal = () => endGameModal.close();

  const playAgainButton = document.querySelector(".play-again");
  const getPlayAgainButton = () => playAgainButton;

  const quitButton = document.querySelector(".quit");
  const getQuitButton = () => quitButton;

  return {
    showStartModal,
    hideStartModal,
    getPlayerOneName,
    getPlayerTwoName,
    getSubmitButton,
    showEndModal,
    hideEndModal,
    getPlayAgainButton,
    getQuitButton,
    getWinningPlayerDiv,
    resetInputs,
  };
})();

const gameFlow = function () {
  const uiManager = UIManager();
  let playerOne;
  let playerTwo;
  let currentPlayer;
  let index;
  let clickedDiv;
  let gameOver = true;

  const initGame = function (playerOneName, playerTwoName) {
    const p1Name = playerOneName === "" ? "Player One" : playerOneName;
    const p2Name = playerTwoName === "" ? "Player Two" : playerTwoName;

    playerOne = player(p1Name, "X");
    playerTwo = player(p2Name, "O");
    currentPlayer = playerOne;
    gameOver = false;
  };

  const rebootGame = function () {
    gameBoard.resetBoard();
    uiManager.resetUIBoard();
    gameOver = false;
    formManager.hideEndModal();
  };

  const quitGame = function () {
    gameBoard.resetBoard();
    uiManager.resetUIBoard();
    gameOver = true;
    formManager.hideEndModal();
    formManager.showStartModal();
  };

  const playAgainButton = formManager
    .getPlayAgainButton()
    .addEventListener("click", rebootGame);
  const quitButton = formManager
    .getQuitButton()
    .addEventListener("click", quitGame);

  const getMoveIndex = function (event) {
    clickedDiv = event.target;
    index = event.target.getAttribute("data-index");
  };

  const getCurrentPlayer = () => currentPlayer;

  const changeCurrentPlayer = function () {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  // game logic
  const playGame = function () {
    submitForm = formManager.getSubmitButton();
    submitForm.addEventListener("click", function () {
      initGame(formManager.getPlayerOneName(), formManager.getPlayerTwoName());
      console.log(playerOne.getName(), playerTwo.getName());
      uiManager.showBoard();
      uiManager.updateScore(playerOne, playerTwo);
      formManager.hideStartModal();
      formManager.resetInputs();
    });

    const grid = uiManager.getMainGrid();
    grid.addEventListener("click", function (event) {
      if (gameOver) {
        return;
      }
      getMoveIndex(event);
      // if it's a valid mmove
      if (gameBoard.checkValidMove(index)) {
        // update the array and the UI
        gameBoard.updateGrid(index, getCurrentPlayer().getMarker());
        uiManager.updateUIGrid(clickedDiv, getCurrentPlayer().getMarker());
        // check if it's a win
        if (gameBoard.checkWinner()) {
          getCurrentPlayer().addWin();
          uiManager.updateScore(playerOne, playerTwo);
          gameOver = true;
          formManager.getWinningPlayerDiv().textContent = `${getCurrentPlayer().getName()} wins!`;
          formManager.showEndModal();
        } else if (gameBoard.checkDraw()) {
          gameOver = true;
          formManager.getWinningPlayerDiv().textContent = "It's a tie.";
          formManager.showEndModal();
        }
        changeCurrentPlayer();
      } else {
        alert("INVALID");
      }
    });
  };

  return {
    getCurrentPlayer,
    changeCurrentPlayer,
    initGame,
    playGame,
    getMoveIndex,
  };
};

document.addEventListener("DOMContentLoaded", function () {
  const startGame = gameFlow();
  startGame.playGame();
});
