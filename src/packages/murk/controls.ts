import { getControlsInternal, setControlButtonMap } from "../sanguine/buttons.js";
import { createTrigger } from "../sanguine/system.js";
import { ControlMessage } from "../sanguine/types.js";

export const createControlTrigger = <T extends ControlMessage>(control: Control, handler: (message: T) => void) => {
    const type = `control_${control}` as const;
    return createTrigger(type, handler);
};

export type Control = 'toggleDesigner'
    | 'select' | 'map' | 'next' | 'interact' | 'escape'
    | 'left' | 'right' | 'up' | 'down'
    | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'
    | 'saveDesign' | 'delete' | 'prefabs' | 'properties';

type ButtonMap = { [key: string]: Control; };

const alwaysButtonMap: ButtonMap = {
    'ShiftRight': 'toggleDesigner',
};

const roomPlayButtonMap: ButtonMap = {
    'LeftClick': 'select',
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

const designerButtonMap: ButtonMap = {
    'RightClick': 'delete',
    'Space': 'prefabs',
    'KeyZ': 'saveDesign',
    'KeyP': 'properties',
};

// TODO mappings will need to be arrays
const allButtonMap: ButtonMap = {};
const addButtonMap = (map: ButtonMap) => {
    for (const [key, value] of Object.entries(map)) {
        allButtonMap[key] = value;
    }
};
addButtonMap(alwaysButtonMap);
addButtonMap(roomPlayButtonMap);
addButtonMap(designerButtonMap);
setControlButtonMap(allButtonMap);

const controlButtonMap: { [key in Control]: string[]; } = {} as any;
const mapButtons = (map: ButtonMap) => {
    for (const [key, value] of Object.entries(map)) {
        controlButtonMap[value] ??= [];
        controlButtonMap[value].push(key);
    }
};

mapButtons(roomPlayButtonMap);
mapButtons(designerButtonMap);

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
};

export const getKeyForControl = (control: Control) => {
    return controlButtonMap[control];
};

export const getFreshPress = (control: Control) => {
    const value = getControl(control);
    return value.current && !value.previous;
};
