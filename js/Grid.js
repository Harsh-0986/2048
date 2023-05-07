const GRID_SIZE = 4;
const CELL_SIZE = 18;
const CELL_GAP = 2;

export default class Grid {
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });

    console.log(this.#cells);
  }

  get cells() {
    return this.#cells;
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;

    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value == tile.value)
    );
  }

  mergeTiles(currScore, bestScore) {
    if (this.tile == null || this.mergeTile == null) return;
    let cscore = parseInt(currScore.innerText, 10);
    cscore += this.tile.value;
    currScore.innerText = cscore.toString();
    this.tile.value = this.tile.value + this.mergeTile.value;
    if (
      parseInt(currScore.innerText, 10) >= parseInt(bestScore.innerText, 10)
    ) {
      best.innerText = currScore.innerText;
    }
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

const createCellElements = (gridElement) => {
  const cells = [];

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }

  return cells;
};
