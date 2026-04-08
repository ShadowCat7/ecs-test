import { drawLine } from "./drawLine.js";

export const drawGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, gridSize: number, color = '#aaa') => {
    let lineX = 0;
    let lineY = 0;

    while (lineX <= width) {
        const newX = x + lineX;

        drawLine(ctx, newX, y, newX, y + height, color);

        lineX += gridSize;
    }

    while (lineY <= width) {
        const newY = y + lineY;

        drawLine(ctx, x, newY, x + width, newY, color);

        lineY += gridSize;
    }
}