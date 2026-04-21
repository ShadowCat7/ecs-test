import { Render } from "../render/types.js";
import { isPointInCircle } from "./circle.js";
import { isPointInRectangle } from "./rectangle.js";

export const isPointInRender = (x: number, y: number, render: Render | Render[], renderX: number, renderY: number): boolean => {
    if (Array.isArray(render)) {
        return render.some(r => isPointInRender(x, y, r, renderX, renderY));
    }

    const shapeX = render.x + renderX;
    const shapeY = render.y + renderY;

    switch (render.type) {
        case "rectangle":
            return isPointInRectangle(x, y, shapeX, shapeY, render.width, render.height);
        case "circle":
            return isPointInCircle(x, y, shapeX, shapeY, render.radius);
        case "grid":
            return false;
        case "text":
            return false;
    }
};
