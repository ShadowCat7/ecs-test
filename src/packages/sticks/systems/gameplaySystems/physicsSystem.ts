import { GRID_SIZE } from "../../constants/game.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getEntity, getEntityList } from "../../../sanguine/entities/entities.js";
import { distance } from "../../../sanguine/physics/distance.js";
import { areRectanglesIntersecting } from "../../../sanguine/physics/rectangle.js";
import { hypotenuse } from "../../../sanguine/physics/triangle.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";

export type CollisionMessage = Message & {
    entity1: Entity,
    entity2: Entity,
};

export const physicsSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        componentType: 'physics',
        process: (components: Component[], elapsedTime: number) => {
            // get all movement rays
            // determine overlap

            for (const component of components as PhysicsComponent[]) {
                let { moveToX, moveToY, entityId, topSpeed } = component;
                const entity = getEntity(entityId);

                if (moveToX !== undefined && moveToY !== undefined) {
                    const distanceBetween = distance(moveToX, moveToY, entity.x, entity.y);

                    if (distanceBetween < topSpeed * elapsedTime) {
                        component.velocityX = 0;
                        component.velocityY = 0;
                        entity.x = moveToX;
                        entity.y = moveToY;
                        component.moveToX = undefined;
                        component.moveToY = undefined;
                    } else {
                        component.velocityX = (entity.x - moveToX) * topSpeed / distanceBetween;
                        component.velocityY = (entity.y - moveToY) * topSpeed / distanceBetween;
                    }
                }

                const x = component.velocityX * elapsedTime;
                const y = component.velocityY * elapsedTime;

                entity.x += x;
                entity.y += y;
            }

            const entities = getEntityList();

            // movers
            for (let i = 0; i < components.length; i++) {
                const entity1 = getEntity(components[i].entityId);

                const { x: x1, y: y1 } = entity1;
                const width1 = GRID_SIZE - 1;
                const height1 = GRID_SIZE - 1;

                // colliders
                for (let j = i + 1; j < entities.length; j++) {
                    const entity2 = entities[j];

                    const { x: x2, y: y2 } = entity2;
                    const width2 = GRID_SIZE - 1;
                    const height2 = GRID_SIZE - 1;

                    if (areRectanglesIntersecting(x1, y1, width1, height1, x2, y2, width2, height2)) {
                        const message = {
                            type: 'collision',
                            entity1,
                            entity2,
                        };

                        messager(message);
                    }
                }
            }
        }
    };
}