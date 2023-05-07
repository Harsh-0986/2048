import Grid from "./Grid.js";
import Tile from "./Tile.js";

// console.log("Console");
const gameBoard = document.getElementById("game-board");
const currScore = document.getElementById("cscore");
const best = document.getElementById("best");

function setupBest() {
  best.innerText = localStorage.getItem("best") || 0;
}

const grid = new Grid(gameBoard);

// Adding initial tiles
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

setupInput();
setTouch();
setupBest();

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  // Merging tiles
  grid.cells.forEach((cell) => cell.mergeTiles(currScore, best));

  // Adding tiles
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  // Game Over Logic
  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
    newTile.waitForTransition(true).then(() => alert("You lose"));
    if (best.innerText < currScore.innerText) return;
    localStorage.setItem("best", currScore.innerText);
    return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((col) => [...col].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

const slideTiles = (cells) => {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
};

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((col) => [...col].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

// Touch Logic

function setTouch() {
  gameBoard.addEventListener("touchstart", handleTouchStart, false);
  gameBoard.addEventListener("touchmove", handleTouchMove, false);
}
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

async function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff < 0) {
      if (!canMoveRight()) {
        setTouch();
        return;
      }
      await moveRight();
    } else {
      if (!canMoveLeft()) {
        setTouch();
        return;
      }
      await moveLeft();
    }
  } else {
    if (yDiff < 0) {
      if (!canMoveDown()) {
        setTouch();
        return;
      }
      await moveDown();
    } else {
      if (!canMoveUp()) {
        setTouch();
        return;
      }
      await moveUp();
    }
  }
  // Merging tiles
  grid.cells.forEach((cell) => cell.mergeTiles(currScore, best));

  // Adding tiles
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  // Game Over Logic
  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
    newTile.waitForTransition(true).then(() => alert("You lose"));
    if (best.innerText < currScore.innerText) return;
    localStorage.setItem("best", currScore.innerText);
    return;
  }

  setTouch();

  /* reset values */
  xDown = null;
  yDown = null;
}
