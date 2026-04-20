import { physicsSystem } from "./physicsSystem.js";
import { playerMovementSystem } from "./playerSystem.js";

export const roomPlaySystems = () => {
    const systems = [
        physicsSystem,
        playerMovementSystem,
    ];

    return systems;
};
