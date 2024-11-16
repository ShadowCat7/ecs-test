import { Entity } from "../types.js";
import { createScene } from "./scene.js"
import { roomPlaySystems } from "../systems/gameplaySystems/roomPlaySystems.js";

export const roomPlayScene = (initialEntities: Entity[]) => {
    return createScene(initialEntities, roomPlaySystems());
}