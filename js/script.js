import Grid from "./Grid.js";
import Tile from "./Tile.js";

// console.log("Console");
const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

// Adding initial tiles
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
