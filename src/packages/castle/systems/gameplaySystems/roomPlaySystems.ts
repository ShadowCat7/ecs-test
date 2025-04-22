import { cameraSystem } from "../cameraSystem.js";
import { edibleSystem } from "./edibleSystem.js";
import { enemySystem } from "./enemySystem.js";
import { followSystem } from "./followSystem.js";
import { physicsSystem } from "./physicsSystem.js"
import { playerSystem } from "./playerSystem.js";
import { sizeSystem } from "./sizeSystem.js";

export const roomPlaySystems = () => {
    const systems = [
        physicsSystem,
        // cameraSystem,
        playerSystem,
        followSystem,
        edibleSystem,
        enemySystem,
        sizeSystem,
    ];

    return systems;
}