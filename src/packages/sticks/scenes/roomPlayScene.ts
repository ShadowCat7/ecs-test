import { createScene } from "../../sanguine/scene.js";
import { Entity } from "../../sanguine/types.js";
import { roomPlaySystems } from "../systems/gameplaySystems/roomPlaySystems.js";

export const roomPlayScene = (initialEntities: Entity[]) => {
    return createScene(initialEntities, roomPlaySystems());
}