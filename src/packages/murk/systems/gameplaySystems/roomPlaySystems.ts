import { gridSystem } from "./gridSystem.js";
import { physicsSystem } from "./physicsSystem.js";
import { playerMovementSystem } from "./playerSystem.js";

export const roomPlaySystems = () => {
    const systems = [
        gridSystem,
        physicsSystem,
        playerMovementSystem,
    ];

    return systems;
};
