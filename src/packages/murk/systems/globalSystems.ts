import { containerSystem } from "./containerSystem.js";
import { interactSystem } from "./interactSystem.js";
import { storySystem } from "./storySystem.js";

export const globalSystems = () => {
    const systems = [
        storySystem,
        containerSystem,
        interactSystem,
    ];

    return systems;
};
