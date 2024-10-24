import { Button } from "../../constants/controls.js";
import { Controls } from "../types.js";

const getButton = (controls: Controls, buttonType: Button) => controls.buttons[buttonType];

export const justPressed = (controls: Controls, buttonType: Button) => {
    const button = getButton(controls, buttonType);
    return button?.current && !button.previous;
}

export const notPressed = (controls: Controls, buttonType: Button) => {
    const button = getButton(controls, buttonType);
    return !button?.current;
}

export const released = (controls: Controls, buttonType: Button) => {
    const button = getButton(controls, buttonType);
    return !button?.current && button?.previous;
}