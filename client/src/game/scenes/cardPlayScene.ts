import { Entity } from "../types.js";
import { createScene } from "./scene.js"
import { cardPlaySystems } from "../systems/gameplaySystems/cardPlaySystems.js";

export const cardPlayScene = (initialEntities: Entity[]) => {
    return createScene(initialEntities, cardPlaySystems());
}