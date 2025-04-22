import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getEntity, getEntityList } from "../../../sanguine/entities/entities.js";
import { distance } from "../../../sanguine/physics/distance.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { CollideableComponent } from "../../components/collideableComponent.js";
import { areCirclesIntersecting } from "../../../sanguine/physics/circle.js";
import { hypotenuse } from "../../../sanguine/physics/triangle.js";
import { maxMagnitude } from "../../../sanguine/util/vector.js";

export type CollisionMessage = Message & {
    entity1: Entity,
    entity2: Entity,
};

const accelerate = (component: PhysicsComponent, velocityToX: number, velocityToY: number, entity: Entity, elapsedTime: number) => {
    const { velocityX, velocityY, topSpeed, acceleration, } = component;
    if (!acceleration) {
        const [newVelocityX, newVelocityY] = maxMagnitude(velocityToX, velocityToY, topSpeed * entity.scale);
        component.velocityX = newVelocityX;
        component.velocityY = newVelocityY;
        return;
    }

    const diff = distance(velocityToX, velocityToY, velocityX, velocityY);

    if (!diff) {
        maxMagnitude(velocityX, velocityY, topSpeed * entity.scale);
        return;
    }

    const accelerationX = (velocityToX - velocityX) * acceleration / diff;
    const accelerationY = (velocityToY - velocityY) * acceleration / diff;

    let [newVelocityX, newVelocityY] = maxMagnitude(velocityX + accelerationX * elapsedTime, velocityY + accelerationY * elapsedTime, topSpeed * entity.scale);

    component.velocityX = newVelocityX;
    component.velocityY = newVelocityY;

    if (isNaN(component.velocityX) || isNaN(component.velocityY)) {
        console.log(velocityX, velocityY);
        debugger
    }
}

export const physicsSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        componentType: 'physics',
        process: (components: Component[], elapsedTime: number) => {
            // get all movement rays
            // determine overlap

            for (const component of components as PhysicsComponent[]) {
                let { moveToX, moveToY, velocityToX, velocityToY, acceleration, entityId, topSpeed } = component;
                const entity = getEntity(entityId);

                if (moveToX !== undefined && moveToY !== undefined) {
                    const distanceBetween = distance(moveToX, moveToY, entity.x, entity.y);

                    const newVelocityX = (moveToX - entity.x) * topSpeed * entity.scale / distanceBetween;
                    const newVelocityY = (moveToY - entity.y) * topSpeed * entity.scale / distanceBetween;

                    accelerate(component, newVelocityX, newVelocityY, entity, elapsedTime);

                    const x = component.velocityX * elapsedTime;
                    const y = component.velocityY * elapsedTime;

                    if (distanceBetween === 0 || hypotenuse(x, y) > distanceBetween) {
                        if (!component.acceleration) {
                            component.velocityX = 0;
                            component.velocityY = 0;
                        }
                        entity.x = moveToX;
                        entity.y = moveToY;
                        component.moveToX = undefined;
                        component.moveToY = undefined;
                    } else {
                        if (entity.prefab?.type === 'camera')
                            var a = 2;
                        entity.x += x;
                        entity.y += y;
                    }
                } else {
                    if (velocityToX !== undefined && velocityToY !== undefined) {
                        accelerate(component, velocityToX, velocityToY, entity, elapsedTime);
                    }

                    const x = component.velocityX * elapsedTime;
                    const y = component.velocityY * elapsedTime;

                    entity.x += x;
                    entity.y += y;
                }
            }

            const entities = getEntityList();

            // movers
            for (let i = 0; i < components.length; i++) {
                const entity1 = getEntity(components[i].entityId);
                const collideable1 = entity1.getComponent<CollideableComponent>('collideable');

                if (!collideable1) continue;

                const { x: x1, y: y1 } = entity1;
                const radius1 = collideable1.radius * entity1.scale;
                // const width1 = GRID_SIZE - 1;
                // const height1 = GRID_SIZE - 1;

                // colliders
                for (let j = i + 1; j < entities.length; j++) {
                    const entity2 = entities[j];
                    const collideable2 = entity2.getComponent<CollideableComponent>('collideable');

                    if (!collideable2) continue;

                    const { x: x2, y: y2 } = entity2;
                    const radius2 = collideable2.radius * entity2.scale;
                    // const width2 = GRID_SIZE - 1;
                    // const height2 = GRID_SIZE - 1;

                    // if (areRectanglesIntersecting(x1, y1, width1, height1, x2, y2, width2, height2)) {
                    if (areCirclesIntersecting(x1, y1, radius1, x2, y2, radius2)) {
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