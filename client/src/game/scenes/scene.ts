import { flushRenderQueue } from "../render/renderQueue.js";
import { addEntities, addEntity, getComponents, getEntityList, setCamera } from "../entities/entities.js";
import { createEntity } from "../entities/entity.js";
import { Prefab } from "../prefabs/types.js";
import { render } from "../render/render.js";
import { Entity, Mailbox, System } from "../types.js";
import { UpdateOptions } from "../types.js";
import { addSubscriber } from "../entities/mailbox.js";

const renderPrefab = (prefab: Prefab, entity: Entity) => {
    if (prefab.shapes?.length) {
        for (const shape of prefab.shapes) {
            render(shape, entity);
        }
    }

    if (!prefab.prefabs?.length) return;

    for (const p of prefab.prefabs) {
        renderPrefab(p, entity);
    }
}

export type Scene = ReturnType<typeof createScene>;

export const createScene = (initialEntities: Entity[], systems: System[]) => {
    const entities = getEntityList();

    const camera = createEntity(0, 0);
    setCamera(camera);

    addEntities(initialEntities);
    addEntity(camera);

    return {
        draw: (ctx: CanvasRenderingContext2D) => {
            for (const entity of entities) {
                if (!entity.visible) continue;

                if (entity.prefab) {
                    renderPrefab(entity.prefab, entity);
                }

                if (!entity.renders?.length) continue;

                for (const shape of entity.renders) {
                    render(shape, entity);
                }
            }

            flushRenderQueue(ctx);
        },
        update: (options: UpdateOptions) => {
            for (const entity of entities) {
                entity.update(options);
            }

            for (const system of systems) {
                const components = getComponents(system.componentType);
                if (!components?.length) continue;

                system.process(components, options.elapsedTime);
            }
        },
        getEntities: () => entities,
    }
}