import { createScene } from "../../sanguine/scene.js";
import { Entity } from "../../sanguine/types.js";
import { roomPlaySystems } from "../systems/gameplaySystems/roomPlaySystems.js";
import { globalSystems } from "../systems/globalSystems.js";

export const roomPlayScene = (initialEntities: Entity[]) => {
    return createScene('test', initialEntities, ...roomPlaySystems(), ...globalSystems());
};
