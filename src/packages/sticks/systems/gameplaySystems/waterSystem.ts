import { WaterComponent } from "../../components/waterComponent.js";
import { FlammableComponent } from "../../components/flammableComponent.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { CollisionMessage } from "./physicsSystem.js";

const handleCollision = (entity1: Entity, entity2: Entity) => {
    const waterComponent = entity1.getComponent('water') as WaterComponent;
    const flammableComponent = entity2.getComponent('flammable') as FlammableComponent;

    if (!waterComponent || !flammableComponent) return;

    flammableComponent.igniteDuration = 0;
    flammableComponent.vaporizeDuration = 0;
}

export const waterSystem = (): System => {
    return {
        triggers: [{
            messageType: 'collision',
            handler: (message: Message) => {
                const { entity1, entity2 } = message as CollisionMessage;
                handleCollision(entity1, entity2);
                handleCollision(entity2, entity1);
            }
        }],
        componentType: 'water',
        process: (components: Component[], elapsedTime: number) => {
            // for (const component of components as WaterComponent[]) {
            // }
        },
    };
}