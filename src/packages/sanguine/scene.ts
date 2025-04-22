import { drawGrid } from "./draw/drawGrid.js";
import { getEntityList, addEntities, addEntity, getComponents, getCamera } from "./entities/entities.js";
import { addSubscriber, sendMail } from "./entities/mailbox.js";
import { render, setupRender } from "./render/render.js";
import { flushRenderQueue } from "./render/renderQueue.js";
import { timerSystem } from "./systems/timerSystem.js";
import { Prefab, Entity, System, Mailbox, Message } from "./types.js";

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

export const createScene = (initialEntities: Entity[], ...systemCreators: ((messager: (message: Message) => void) => System)[]) => {
    let mailbox: Mailbox = {};

    const messageSender = (message: Message) => sendMail(message, mailbox);

    const systems = [
        timerSystem,
        ...systemCreators
    ].map(x => x(messageSender));

    for (let system of systems) {
        if (!system.triggers?.length) continue;

        for (let trigger of system.triggers)
            addSubscriber(mailbox, trigger.messageType, trigger.handler);
    }

    const entities = getEntityList();

    addEntities(initialEntities);

    return {
        draw: (ctx: CanvasRenderingContext2D) => {
            setupRender(ctx);

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
        update: (elapsedTime: number) => {
            for (const system of systems) {
                const components = getComponents(system.componentType);
                system.process(components ?? [], elapsedTime);
            }
        },
        getEntities: () => entities,
    }
}