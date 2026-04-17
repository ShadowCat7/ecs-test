import { Dictionary } from "./util/utilTypes.js";
import { ControlHistoryItem, Mouse } from "./types.js";

let mousePosition: [number, number] = [0, 0];

export const getMousePosition = () => mousePosition;

const updateControl = (control: ControlHistoryItem | undefined, value: boolean) => {
    if (!control) return;
    control.previous = control.current;
    control.current = value;
};

let controls: { [control: string]: ControlHistoryItem; } = {};

export const getControlsInternal = () => controls;

let controlButtonMap: Dictionary<string, string> = {};
export const setControlButtonMap = (newControlButtonMap: Dictionary<string, string>) => {
    controlButtonMap = newControlButtonMap;

    for (let controlKey of Object.values(controlButtonMap)) {
        if (!controlKey) continue;
        controls[controlKey] = {
            previous: false,
            current: false,
        };
    }
};

const handleControl = (controlButtonMap: Dictionary<string, string>, button: string, value: boolean) => {
    const control = controlButtonMap[button];

    if (control) updateControl(controls[control], value);
};

export type ControlEventHandler = (control: string, current: boolean, previous: boolean) => void;
const controlEventHandlers: ControlEventHandler[] = [];

export const addControlEventHandler = (eventHandler: ControlEventHandler) => {
    controlEventHandlers.push(eventHandler);
};

const resolved = Promise.resolve();
export const raiseControlEvent = (e: KeyboardEvent) => {
    const control = controlButtonMap[e.code];
    if (!control) return resolved;
    return new Promise<void>((resolve) => {
        const history = controls[control];
        for (const eventHandler of controlEventHandlers) {
            eventHandler(control, e.type === 'keydown', history.current);
        }
        resolve();
    });
};

export type WheelEventHandler = (delta: number) => void;
const wheelEventHandlers: WheelEventHandler[] = [];

export const addWheelEventHandler = (eventHandler: WheelEventHandler) => {
    wheelEventHandlers.push(eventHandler);
};

export const raiseWheelEvent = (delta: number) => {
    return new Promise<void>((resolve) => {
        for (const eventHandler of wheelEventHandlers) {
            eventHandler(delta);
        }
        resolve();
    });
};

export const updateControls = (buttonsPressed: { [button: string]: boolean; }, mouse: Mouse) => {
    for (let button in buttonsPressed) {
        handleControl(controlButtonMap, button, buttonsPressed[button]);
    }

    handleControl(controlButtonMap, 'LeftClick', mouse.leftClick);
    handleControl(controlButtonMap, 'RightClick', mouse.rightClick);

    mousePosition = [mouse.x, mouse.y];
};