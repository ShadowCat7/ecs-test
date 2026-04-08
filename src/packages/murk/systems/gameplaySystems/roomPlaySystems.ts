import { gridSystem } from "./gridSystem.js";
import { physicsSystem } from "./physicsSystem.js"
import { playerSystem } from "./playerSystem.js";

export const roomPlaySystems = () => {
    const systems = [
        gridSystem,
        physicsSystem,
        playerSystem,
    ];

    return systems;
}