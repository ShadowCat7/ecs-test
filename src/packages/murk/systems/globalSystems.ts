import { cameraSystem } from "./cameraSystem.js";
import { containerSystem } from "./containerSystem.js";
import { storySystem } from "./storySystem.js";

export const globalSystems = () => {
    const systems = [
        storySystem,
        containerSystem,
        cameraSystem,
    ];

    return systems;
};
