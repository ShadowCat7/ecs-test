import { Message, ControlMessage, System } from "../../sanguine/types.js";
import { addControlEventHandler } from "../buttons.js";

export const controlSystem = (
    messager: (message: Message) => void,
): System => {
    addControlEventHandler((control, current, previous) => {
        const message: ControlMessage = {
            type: `control_${control}`,
            current,
            previous,
        };
        messager(message);
    });
    return {
        componentType: null,
        process: null,
    };
};