import { Entity } from "../../sanguine/types.js";
import { GRID_SIZE } from "../constants/game.js";

let currentGrid = new Map();

export const resetGrid = () => {
    currentGrid = new Map();
}

export const addItemToGrid = (entity: Entity) => {
    const { x, y } = entity;
    const key = getGridKey(x, y);
    currentGrid.set(key, entity);
}

export const getItemFromGrid = (x: number, y: number) => {
    const key = getGridKey(x, y);
    currentGrid.get(key);
}

const getGridKey = (x: number, y: number) => {
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);
    return `${gridX},${gridY}`;
}