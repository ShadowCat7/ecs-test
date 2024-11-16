import { FireComponent } from "../../components/fireComponent.js";
import { FlammableComponent } from "../../components/flammableComponent.js";
import { getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { CollisionMessage } from "./physicsSystem.js";

const handleCollision = (entity1: Entity, entity2: Entity) => {
    const fireComponent = entity1.getComponent('fire') as FireComponent;
    const flammableComponent = entity2.getComponent('flammable') as FlammableComponent;

    if (!fireComponent || !flammableComponent) return;

    flammableComponent.igniteDuration = 2;
}

export const flammableSystem = (): System => {
    return {
        triggers: [{
            messageType: 'collision',
            handler: (message: Message) => {
                const { entity1, entity2 } = message as CollisionMessage;
                handleCollision(entity1, entity2);
                handleCollision(entity2, entity1);
            }
        }],
        componentType: 'flammable',
        process: (components: Component[], elapsedTime: number) => {
            for (const component of components as FlammableComponent[]) {
                if (component.igniteDuration > 0) {
                    component.vaporizeDuration += elapsedTime;
                }

                if (component.vaporizeDuration >= component.untilVaporize) {
                    const entity = getEntity(component.entityId);
                    removeEntity(component.entityId);
                    // addEntity(dirt(entity.x, entity.y)); // TODO another component
                }
            }
        },
    };
}