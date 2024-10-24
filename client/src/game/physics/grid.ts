import { GRID_SIZE } from "../../constants/game.js";

export const snapToGrid = (x: number, y: number, gridSize = GRID_SIZE) => {
    return [
        Math.floor(x / gridSize) * gridSize,
        Math.floor(y / gridSize) * gridSize,
    ];
}

const getGridCoordinates = (x: number, y: number, gridSize = GRID_SIZE) => {
    return [
        Math.floor(x / gridSize),
        Math.floor(y / gridSize),
    ];
};

export const gridSquareDistaince = (x1: number, y1: number, x2: number, y2: number, gridSize = GRID_SIZE, diagonalAlternate = 0) => {
    let diff1 = Math.abs(x2 - x1);
    let diff2 = Math.abs(y2 - y1);

    if (diff1 < diff2) {
        const temp = diff1;
        diff1 = diff2;
        diff2 = temp;
    }

    let diagonals = diagonalAlternate + diff2;

    let distance = diff1 - diff2;

    const isOdd = diagonals % 2;

    distance += Math.ceil((diff2 - isOdd) * 3 / 2 + isOdd);

    return distance;
};

export const gridDistance = (x1: number, y1: number, x2: number, y2: number, gridSize = GRID_SIZE, diagonalAlternate = 0) => {
    const [gridX1, gridY1] = getGridCoordinates(x1, y1, gridSize);
    const [gridX2, gridY2] = getGridCoordinates(x2, y2, gridSize);

    let diff1 = Math.abs(gridX2 - gridX1);
    let diff2 = Math.abs(gridY2 - gridY1);

    if (diff1 < diff2) {
        const temp = diff1;
        diff1 = diff2;
        diff2 = temp;
    }

    let diagonals = diagonalAlternate + diff2;

    let distance = diff1 - diff2;

    const isOdd = diagonals % 2;

    distance += Math.ceil((diff2 - isOdd) * 3 / 2 + isOdd);

    return distance;
};

export const getDiagonalDiff = (x1: number, y1: number, x2: number, y2: number, gridSize = GRID_SIZE) => {
    const [gridX1, gridY1] = getGridCoordinates(x1, y1, gridSize);
    const [gridX2, gridY2] = getGridCoordinates(x2, y2, gridSize);

    let diff1 = Math.abs(gridX2 - gridX1);
    let diff2 = Math.abs(gridY2 - gridY1);

    return Math.min(diff1, diff2);
}