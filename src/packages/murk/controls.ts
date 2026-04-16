import { getControlsInternal, setControlButtonMap } from "../sanguine/buttons.js";
import { assertMessage } from "../sanguine/messages.js";
import { createTrigger } from "../sanguine/system.js";
import { ControlMessage, Message } from "../sanguine/types.js";
import { groupMap } from "../sanguine/util/array.js";

export const createControlTrigger = <T extends ControlMessage>(control: Control, handler: (message: T) => void) => {
    const type = `control_${control}` as const;
    return createTrigger(type, handler);
};

export type Control = 'click' | 'map' | 'next' | 'interact' | 'escape'
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
    'Escape': 'escape',
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

const buttonControlMap: { [key in Control]: string[]; } = {} as any;
for (const [key, value] of Object.entries(controlButtonMap)) {
    buttonControlMap[value] ??= [];
    buttonControlMap[value].push(key);
}

setControlButtonMap(controlButtonMap);

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
};

export const getKeyForControl = (control: Control) => {
    return buttonControlMap[control];
};

export const getFreshPress = (control: Control) => {
    const value = getControl(control);
    return value.current && !value.previous;
};
