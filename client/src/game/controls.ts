import { buttons as BUTTONS, Button } from "../constants/controls.js";
import { Dictionary } from "../util/utilTypes.js";
import { ControlHistoryItem, Controls, Mouse } from "./types.js";

const controlMap: Dictionary<string, Button> = {
    'LeftClick': BUTTONS.click,
    'KeyM': BUTTONS.map,
    'KeyW': BUTTONS.up,
    'KeyA': BUTTONS.left,
    'KeyS': BUTTONS.down,
    'KeyD': BUTTONS.right,
};

const updateControl = (control: ControlHistoryItem | undefined, value: boolean) => {
    if (!control) return;
    control.previous = control.current;
    control.current = value;
}

export const createControls = () => {
    const controls: Controls = {
        mouse: [0, 0],
        buttons: {},
    };

    const { buttons } = controls;

    for (let control of Object.values(BUTTONS)) {
        buttons[control] = {
            previous: false,
            current: false,
        };
    }

    return {
        update: (buttonsPressed: Dictionary<string, boolean>, mouse: Mouse) => {
            for (let button in buttonsPressed) {
                const buttonControl = controlMap[button];

                if (buttonControl) {
                    updateControl(controls.buttons[buttonControl], buttonsPressed[button]!);
                }
            }

            updateControl(controls.buttons[BUTTONS.click], mouse.leftClick);
            // right click
            // updateControl(controls[CONTROLS.], mouse.rightClick);

            controls.mouse[0] = mouse.x;
            controls.mouse[1] = mouse.y;
        },
        getControls: () => controls,
        // getMouse: () => controls.mouse,
        // isPressed: (control) => controls[control].current,
        // justPressed: (control) => controls[control].current && !controls[control].previous,
        // isReleased: (control) => !controls[control].current,
        // justReleased: (control) => !controls[control].current && controls[control].previous,
        // isHeld: (control) => controls[control].current && controls[control].previous,
        // // isCompletelyUntouched: (control) => !controls[control].current && !controls[control].previous,
        // nonePressed: (controlList) => {
        //     const anyPressed = controlList.find(control => controls[control]);
        //     return !anyPressed;
        // },
    }
};