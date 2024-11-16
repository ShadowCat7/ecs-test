import { CONTROLS } from "../../../constants/controls.js";
import { isPointInRectangle } from "../../physics/rectangle.js";

export const createDraggableComponent = () => {
    return {
        draw: () => {
        },
        update: (data, options) => {
            const { x, y, width } = data;
            const { controls } = options;

            const [mouseX, mouseY] = controls.getMouse();

            if (controls.isPressed(CONTROLS.click)) {
                if (data.isDragged) {
                    data.x = mouseX - width / 2;
                    data.y = mouseY - width / 2;
                } else if (isPointInRectangle(mouseX, mouseY, x, y, width, width)) {
                    data.isDragged = true;
                }
            } else {
                data.isDragged = false;
            }
        }
    };
}