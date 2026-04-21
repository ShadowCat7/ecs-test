import { createScene } from "../../sanguine/scene.js";
import { Entity } from "../../sanguine/types.js";
import { designerSystems } from "../systems/designerSystems/designerSystems.js";
import { globalSystems } from "../systems/globalSystems.js";

export const designerScene = (initialEntities: Entity[]) => {
    return createScene('designer', initialEntities, ...designerSystems(), ...globalSystems());
};
