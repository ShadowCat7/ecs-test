import { addDraw, DRAW_ORDER } from "../../draw/orderedDraw.js";

export const createSelectedComponent = () => {
    return {
        draw: (data, options) => {
            addDraw(DRAW_ORDER.BACKGROUND, () => {
                const { x, y, width, selected } = data;
                const { ctx } = options;

                if (selected) {
                    ctx.strokeStyle = 'yellow';
                    ctx.strokeRect(x - 2, y - 2, width + 4, width + 4);
                }
            });
        },
        update: (data, options) => {
        }
    };
}