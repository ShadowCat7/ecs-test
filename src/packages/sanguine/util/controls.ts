import { ControlHistoryItem } from "../types.js";

export const justPressed = (control: ControlHistoryItem) => {
    return control.current && !control.previous;
}

export const released = (control: ControlHistoryItem) => {
    return !control.current && control.previous;
}

export const held = (control: ControlHistoryItem) => {
    return control.current && control.previous;
}