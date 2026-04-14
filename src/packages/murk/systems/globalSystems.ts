import { conversationSystem } from "./conversationSystem.js";
import { storySystem } from "./storySystem.js";

export const globalSystems = () => {
    const systems = [
        storySystem,
        conversationSystem,
    ];

    return systems;
};