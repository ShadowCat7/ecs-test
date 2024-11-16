import { createScene } from "../../sanguine/scene.js";
import { Entity } from "../../sanguine/types.js";
import { cardPlaySystems } from "../systems/gameplaySystems/cardPlaySystems.js";

export const cardPlayScene = (initialEntities: Entity[]) => {
    return createScene(initialEntities, cardPlaySystems());
}