import { getCamera } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { getControl, getFreshPress } from "../../controls.js";

const CAMERA_SPEED = 500;

export const designerSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [
        ],
        componentType: '',
        process: (components: Component[], elapsedTime: number) => {
            const camera = getCamera();
            if (!camera) return;

            if (getControl('left').current) {
                camera.x -= CAMERA_SPEED * elapsedTime;
            }
            if (getControl('right').current) {
                camera.x += CAMERA_SPEED * elapsedTime;
            }
            if (getControl('up').current) {
                camera.y -= CAMERA_SPEED * elapsedTime;
            }
            if (getControl('down').current) {
                camera.y += CAMERA_SPEED * elapsedTime;
            }
        },
    };
};