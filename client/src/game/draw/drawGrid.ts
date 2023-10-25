import { GRID_SIZE } from "../../constants/game.js";
import { drawLine } from "./drawLine.js";

export const drawGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color = '#aaa', gridSize = GRID_SIZE) => {
    let lineX = 0;
    let lineY = 0;

    while (lineX <= width) {
        const newX = x + lineX;

        if (newX >= 0) {
            drawLine(ctx, newX, y, newX, y + height, color);
        }

        lineX += gridSize;
    }

    while (lineY <= width) {
        const newY = y + lineY;

        if (newY >= 0) {
            drawLine(ctx, x, newY, x + width, newY, color);
        }

        lineY += gridSize;
    }
}