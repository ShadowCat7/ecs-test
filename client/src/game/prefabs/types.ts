import { Render } from "../render/types.js";
import { Component, Entity, UpdateOptions } from "../types.js";

export type Prefab = {
    type: string,
    components: (() => Component)[],
    shapes?: Render[],
    prefabs?: Prefab[],
    script?: (entity: Entity, options: UpdateOptions) => void,
    createEntity: (x: number, y: number) => Entity,
}