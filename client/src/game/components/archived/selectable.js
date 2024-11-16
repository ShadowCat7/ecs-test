import { CONTROLS } from "../../../constants/controls.js";
import { isPointInRectangle } from "../../physics/rectangle.js";

export const createSelectableComponent = () => {
    return {
        draw: (data, options) => {
        },
        update: (data, options) => {
            const { x, y, width, selected } = data;
            const { controls } = options;

            const [mouseX, mouseY] = controls.getMouse();

            if (!selected && controls.justReleased(CONTROLS.CLICK) && isPointInRectangle(mouseX, mouseY, x, y, width, width)) {
                data.selected = true;
            }
        }
    };
}