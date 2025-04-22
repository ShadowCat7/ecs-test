import { getControlsInternal, setControlButtonMap } from "../sanguine/buttons.js";
import { keyValueSwitch } from "../sanguine/util/object.js";

export type Control = 'click' | 'map' | 'left' | 'right' | 'up' | 'down';

const buttonControlMap: { [T in Control]: string } = {
    click: 'LeftClick',
    map: 'KeyM',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown',
}

let controlButtonMap = keyValueSwitch(buttonControlMap);

setControlButtonMap(controlButtonMap);

export const getControl = (control: Control) => {
    return getControlsInternal()[control];
}