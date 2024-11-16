import { drawRectangle } from "../../draw/drawRectangle.js";
import { addDraw, DRAW_ORDER } from "../../draw/orderedDraw.js";

export const drawSquareComponent = (width) => {
    return {
        start: (data) => {
            data.width = width;
            data.height = width;
        },
        draw: (data, { ctx }) => {
            addDraw(DRAW_ORDER.GAME, () => {
                drawRectangle(ctx, data.x, data.y, width, width, 'blue');
            });
        },
        update: () => {},
    }
}