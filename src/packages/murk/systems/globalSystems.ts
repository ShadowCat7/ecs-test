import { interactSystem } from "./interactSystem.js";
import { storySystem } from "./storySystem.js";

export const globalSystems = () => {
    const systems = [
        storySystem,
        interactSystem,
    ];

    return systems;
};