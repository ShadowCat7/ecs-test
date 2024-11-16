import { createEntity } from "../entities/entity.js";
import { Render } from "../render/types.js";
import { Component, Entity, UpdateOptions } from "../types.js";
import { Prefab } from "./types.js";

export const prefab = (
    type: string,
    components: (() => Component)[],
    shapes?: Render[],
    prefabs?: Prefab[],
    script?: (entity: Entity, options: UpdateOptions) => void,
): Prefab => {
    const p = {
        type,
        components,
        shapes,
        prefabs,
        script,
        createEntity: (x: number, y: number) => {
            return createEntity(
                x,
                y,
                p,
                shapes,
            );
        }
    };

    return p;
}