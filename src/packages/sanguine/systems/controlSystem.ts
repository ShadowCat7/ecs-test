import { Message, ControlMessage, System, WheelMessage } from "../../sanguine/types.js";
import { addControlEventHandler, addWheelEventHandler } from "../buttons.js";

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
    addWheelEventHandler((delta: number) => {
        const message: WheelMessage = {
            type: 'wheel',
            delta,
        };
        messager(message);
    });
    return {
        componentType: null,
        process: null,
    };
};