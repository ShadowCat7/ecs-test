import { Entity } from "../entities/types.js";
import { Mouse, UpdateOptions } from "../types.js";

export const createScene = (initialEntities: Entity[]) => {
    const entities: Entity[] = [...initialEntities];

    return {
        draw: (options: { ctx: CanvasRenderingContext2D, mouse: Mouse }) => {
            for (let entity of entities) {
                entity.draw(options);
            }
        },
        update: (options: UpdateOptions) => {
            let entityOptions = {
                entities,
                ...options,
            };

            for (let entity of entities) {
                entity.update(entityOptions);
            }
        },
    }
}