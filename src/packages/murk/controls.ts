import { getControlsInternal, setControlButtonMap } from "../sanguine/buttons.js";
import { keyValueSwitch } from "../sanguine/util/object.js";

export type Control = 'click' | 'map' | 'left' | 'right' | 'up' | 'down' | '1' | '2';

const buttonControlMap: { [T in Control]: string } = {
    click: 'LeftClick',
    map: 'KeyM',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown',
    1: 'Digit1',
    2: 'Digit2'
};

let controlButtonMap = keyValueSwitch(buttonControlMap);

setControlButtonMap(controlButtonMap);

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
};

export const getFreshPress = (control: Control) => {
    const value = getControl(control);
    return value.current && !value.previous;
};
