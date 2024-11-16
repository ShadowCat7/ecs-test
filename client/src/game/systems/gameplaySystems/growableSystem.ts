import { WaterComponent } from "../../components/waterComponent.js";
import { GrowableComponent } from "../../components/growableComponent.js";
import { getEntity, removeEntity } from "../../entities/entities.js";
import { Component, Entity, Message, System } from "../../types.js";
import { CollisionMessage } from "./physicsSystem.js";

const handleCollision = (entity1: Entity, entity2: Entity) => {
    const waterComponent = entity1.getComponent('water') as WaterComponent;
    const growableComponent = entity2.getComponent('growable') as GrowableComponent;

    if (!waterComponent || !growableComponent) return;

    growableComponent.germinationDuration = 2;
}

export const growableSystem = (): System => {
    return {
        triggers: [{
            messageType: 'collision',
            handler: (message: Message) => {
                const { entity1, entity2 } = message as CollisionMessage;
                handleCollision(entity1, entity2);
                handleCollision(entity2, entity1);
            }
        }],
        componentType: 'growable',
        process: (components: Component[], elapsedTime: number) => {
            for (const component of components as GrowableComponent[]) {
                if (component.germinationDuration > 0) {
                    component.growingDuration += elapsedTime;
                }

                if (component.growingDuration >= component.untilGrown) {
                    const entity = getEntity(component.entityId);
                    removeEntity(entity.id);
                    // addEntity(grass(entity.x, entity.y)); // TODO another component
                }
            }
        },
    };
}