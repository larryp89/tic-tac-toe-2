const gameBoard = (function () {
  const grid = ["O", "X", "O", "", "", "", "", "", ""];

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

    return false;
  };

  const checkValidMove = function (move) {
    if (grid[move] === "") {
      updateGrid(move);
    } else {
      return "FAIL";
    }
  };

  return { grid, updateGrid, checkWinner, checkValidMove };
})();

const player = function (name, marker) {
  const playerName = name;
  const playerMarker = marker;

  return { playerName, playerMarker };
};
