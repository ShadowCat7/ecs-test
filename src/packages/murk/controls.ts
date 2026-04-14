import { getControlsInternal, setControlButtonMap } from "../sanguine/buttons.js";
import { assertMessage } from "../sanguine/messages.js";
import { ControlMessage, Message } from "../sanguine/types.js";

export const createControlTrigger = <T extends ControlMessage>(control: Control, handler: (message: T) => void) => {
    const type = `control_${control}` as const;
    return {
        messageType: type,
        handler: (message: Message) => {
            assertMessage<T>(message, type);
            handler(message);
        },
    };
};

export type Control = 'click' | 'map' | 'next' | 'interact'
    | 'left' | 'right' | 'up' | 'down'
    | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';

const controlButtonMap: { [key: string]: Control; } = {
    'LeftClick': 'click',
    'KeyM': 'map',
    'KeyN': 'next',
    'KeyE': 'interact',
    'KeyA': 'left',
    'KeyD': 'right',
    'KeyS': 'down',
    'KeyW': 'up',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
};

setControlButtonMap(controlButtonMap);

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
};

export const getFreshPress = (control: Control) => {
    const value = getControl(control);
    return value.current && !value.previous;
};
