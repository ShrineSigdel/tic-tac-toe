const title = document.querySelector(".title");

//sounds for the game
let audio_pop = new Audio("./audio/pop.mp3");
let audio_winner = new Audio("./audio/winner.mp3");

const startgame = document.querySelector("#start-game");
startgame.addEventListener("click", () => {
  audio_pop.play();
  startgame.classList.add("hidden");
  title.textContent = "";
  Game.start();
});

const restartGame = document.querySelector("#restart-game");
restartGame.addEventListener("click", () => {
  audio_pop.play();
  Game.restart();
});

const Gameboard = (() => {
  let board;

  const addToDom = () => {
    const body = document.querySelector("body");
    const gameboard = document.createElement("div");
    gameboard.classList.add("gameboard");
    body.appendChild(gameboard);
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const render = () => {
    let cell = "";
    board.forEach((boardPiece, index) => {
      cell += `<div class = "cell" id = "index-${index}">${boardPiece}</div>`;
    });
    document.querySelector(".gameboard").innerHTML = cell;
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", Game.handleClickEvent);
    });
  };

  const update = (index, sign, checkForTie) => {
    board[index] = sign;
    checkWinningCondtion(board);
    if (checkForTie === 9 && title.textContent === "") {
      title.textContent = `Game has tied !!!`;
      updateGameOver();
    }
  };

  return {
    render,
    addToDom,
    update,
  };
})();

const checkWinningCondtion = (board) => {
  const winningConditions = [
    [0, 1, 2],
    [1, 2, 3],
    [3, 4, 5],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  winningConditions.forEach((e) => {
    if (
      board[e[0]] === board[e[1]] &&
      board[e[1]] === board[e[2]] &&
      board[e[0]] !== ""
    ) {
      const declareWinner = `${board[e[0]]} has won !!!`;
      title.textContent = declareWinner;
      updateGameOver();
    }
  });
};

const updateGameOver = () => {
  audio_winner.play();
  restartGame.classList.remove("hidden");
};

const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  //create Players
  let players = [];
  players = [createPlayer("player1", "X"), createPlayer("player2", "O")];
  let currentPlayerIndex;
  let checkForTie;

  const start = () => {
    Gameboard.addToDom();
    Gameboard.render();
    checkForTie = 0;
    currentPlayerIndex = 0;
  };

  const handleClickEvent = (event) => {
    if (event.target.innerHTML === "") {
      let mark = players[currentPlayerIndex].mark;
      event.target.innerHTML = mark;
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      checkForTie++;
      Gameboard.update(event.target.id.slice(-1), mark, checkForTie);
    }
  };

  const restart = () => {
    const gameboard = document.querySelector(".gameboard");
    gameboard.remove();
    restartGame.classList.add("hidden");
    title.textContent = "";
    Game.start();
  };

  return {
    start,
    handleClickEvent,
    restart,
  };
})();
