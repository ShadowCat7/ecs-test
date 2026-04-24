import { dialogueSystem } from "./dialogueSystem.js";
import { interactSystem } from "./interactSystem.js";
import { physicsSystem } from "./physicsSystem.js";
import { playerMovementSystem } from "./playerSystem.js";

export const roomPlaySystems = () => {
    const systems = [
        dialogueSystem,
        physicsSystem,
        playerMovementSystem,
        interactSystem,
    ];

    return systems;
};
