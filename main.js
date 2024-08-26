const player = function (name, marker) {
  const playerName = name;
  const playerMarker = marker;
  let score = 0;
  const getScore = () => score;
  const addWin = function () {
    score += 1;
  };

  return { playerName, playerMarker, addWin, getScore };
};

const gameBoard = (function () {
  const grid = ["", "", "", "", "", "", "", "", ""];
  let playerOne;
  let playerTwo;
  let currentPlayer;

  const resetBoard = function () {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = "";
    }
  };

  const initGame = function (playerOneName, playerTwoName) {
    playerOne = player(playerOneName, "X");
    playerTwo = player(playerTwoName, "O");
    currentPlayer = playerOne;
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
    return grid.every(function (cell) {
      return cell !== "";
    });
  };

  const checkValidMove = function (index) {
    if (grid[index] === "") {
      return true;
    }
  };

  const getCurrentPlayer = () => currentPlayer;

  const changeCurrentPlayer = function () {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  return {
    grid,
    updateGrid,
    checkWinner,
    checkDraw,
    checkValidMove,
    getCurrentPlayer,
    changeCurrentPlayer,
    initGame,
    resetBoard,
  };
})();

const UIManager = function () {
  const dialog = document.querySelector("dialog");
  // show modal
  const showModal = () => dialog.showModal();
  const hideModal = () => dialog.close();

  // get form inputs
  const submitButton = document
    .querySelector("#submit")
    .addEventListener("click", function () {
      const playerOneName = document.querySelector("#player-one").value;
      const playerTwoName = document.querySelector("#player-two").value;
      gameBoard.initGame(playerOneName, playerTwoName);
      hideModal();
      const mainWrapper = document.querySelector(".main-wrapper");
      mainWrapper.classList.toggle("hidden");
    });

  // get DOM element, add event listener and game-flow
  const mainGrid = document.querySelector(".main-grid");

  const updateGrid = function (div, marker) {
    div.textContent = marker;
  };

  const resetBoard = function () {
    allDivs = document.querySelectorAll(".main-grid>div");
    for (let div of allDivs) {
      div.textContent = "";
    }
  };

  mainGrid.addEventListener("click", function (event) {
    // get the current player
    let currentPlayer = gameBoard.getCurrentPlayer();
    // identify the clicked div
    let clickedDiv = event.target;
    // get index of the div clicked to update the grid array
    let divIndex = parseInt(clickedDiv.getAttribute("data-index"));
    // get marker of the current player
    marker = currentPlayer.playerMarker;

    // if it's a valid move
    if (gameBoard.checkValidMove(divIndex)) {
      // update the array grid and UI grid
      gameBoard.updateGrid(divIndex, marker);
      updateGrid(clickedDiv, marker);
      // check if there is a winner
      if (gameBoard.checkWinner() || gameBoard.checkDraw()) {
        // show modal with playAgain or quit
        // if playAgain, update the scores and reset board and UI
      }
      // Otherwise
      gameBoard.changeCurrentPlayer();
    } else {
      alert("Invalid move");
    }
  });

  return { resetBoard, showModal };
};

document.addEventListener("DOMContentLoaded", function () {
  UIInstance = UIManager();
  UIInstance.showModal();
});
