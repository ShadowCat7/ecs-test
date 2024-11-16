import { distance } from "../../physics/distance.js";

export const createMoveToComponent = () => {
    return {
        draw: () => {
        },
        update: (data, options) => {
            const { speed, moveTo, x, y } = data;
            const { elapsedTime } = options;

            if (moveTo) {
                let {
                    x: moveToX,
                    y: moveToY,
                } = moveTo;

                const dist = distance(x, y, moveToX, moveToY);

                if (dist < 5) {
                    data.x = moveToX;
                    data.y = moveToY;
                    data.velocityX = 0;
                    data.velocityY = 0;
                    data.moveTo = null;
                    return;
                }

                // vx / v = dx / dist
                data.velocityX = speed * (moveTo.x - x) / dist;
                data.velocityY = speed * (moveTo.y - y) / dist;
            } else {
            }
        },
    };
}