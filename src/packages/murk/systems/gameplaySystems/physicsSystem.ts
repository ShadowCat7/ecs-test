import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getEntity, getEntityQuadtree, recreateQuadTree } from "../../../sanguine/entities/entities.js";
import { distance } from "../../../sanguine/physics/distance.js";
import { Component, Entity, Message, System } from "../../../sanguine/types.js";
import { CollideableComponent } from "../../components/collideableComponent.js";
import { hypotenuse } from "../../../sanguine/physics/triangle.js";
import { addVector, maxMagnitude, reduceMagnitude, setMagnitudeVector, subtractVector } from "../../../sanguine/util/vector.js";
import { CollisionMessage } from "./types.js";

const accelerate = (component: PhysicsComponent, velocityToX: number, velocityToY: number, entity: Entity, elapsedTime: number) => {
    const { velocityX, velocityY, topSpeed, acceleration } = component;
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
                let { moveToX, moveToY, velocityToX, velocityToY, entityId, topSpeed } = component;
                const entity = getEntity(entityId);
                component.previousX = entity.x;
                component.previousY = entity.y;

                if (moveToX !== undefined && moveToY !== undefined) {
                    const distanceBetween = distance(moveToX, moveToY, entity.x, entity.y);

                    const newVelocityX = (moveToX - entity.x) * topSpeed * entity.scale / distanceBetween;
                    const newVelocityY = (moveToY - entity.y) * topSpeed * entity.scale / distanceBetween;

                    accelerate(component, newVelocityX, newVelocityY, entity, elapsedTime);

                    component.previousVelocityX = component.velocityX;
                    component.previousVelocityY = component.velocityY;

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
                        entity.x += x;
                        entity.y += y;
                    }
                } else {
                    if (velocityToX !== undefined && velocityToY !== undefined) {
                        accelerate(component, velocityToX, velocityToY, entity, elapsedTime);
                    }

                    component.previousVelocityX = component.velocityX;
                    component.previousVelocityY = component.velocityY;

                    const x = component.velocityX * elapsedTime;
                    const y = component.velocityY * elapsedTime;

                    entity.x += x;
                    entity.y += y;
                }

                const { friction, velocityX, velocityY } = component;
                if (friction && (velocityX || velocityY)) {
                    const [newVelocityX, newVelocityY] = reduceMagnitude(velocityX, velocityY, friction, 0);
                    component.velocityX = newVelocityX;
                    component.velocityY = newVelocityY;
                }
            }

            recreateQuadTree();
            const quadTree = getEntityQuadtree();
            const concluded = new Set<string>();

            for (let i = 0; i < components.length; i++) {
                const entity1 = getEntity(components[i].entityId);
                concluded.add(entity1.id);
                const physics1 = entity1.getComponent<PhysicsComponent>('physics');
                const collideable1 = entity1.getComponent<CollideableComponent>('collideable');

                if (!physics1 || !collideable1) continue;

                const { x: x1, y: y1 } = entity1;
                const radius1 = collideable1.radius * entity1.scale;

                const nearest = quadTree.nearest(x1, y1, 200);

                // colliders
                for (let j = 0; j < nearest.length; j++) {
                    const entity2 = nearest[j];
                    if (concluded.has(entity2.id)) continue;
                    const physics2 = entity2.getComponent<PhysicsComponent>('physics');
                    const collideable2 = entity2.getComponent<CollideableComponent>('collideable');

                    if (!collideable2) continue;

                    const radius2 = collideable2.radius * entity2.scale;

                    const xDiff = (physics2?.previousX ?? entity2.x) - physics1.previousX;
                    const yDiff = (physics2?.previousY ?? entity2.y) - physics1.previousY;
                    const vXDiff = (physics2?.previousVelocityX ?? 0) - physics1.previousVelocityX;
                    const vYDiff = (physics2?.previousVelocityY ?? 0) - physics1.previousVelocityY;
                    const a = vXDiff * vXDiff + vYDiff * vYDiff;
                    const b = 2 * (vXDiff * xDiff + vYDiff * yDiff);
                    const c = xDiff * xDiff + yDiff * yDiff - Math.pow(radius1 + radius2, 2);

                    if (a === 0) {
                        continue;
                    }

                    const discriminant = b * b - 4 * a * c;
                    if (discriminant < 0) {
                        continue;
                    }

                    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

                    let collisionTime;
                    if (t1 >= 0 && t2 >= 0) {
                        collisionTime = Math.min(t1, t2);
                    } else if (t1 >= 0) {
                        collisionTime = t1;
                    } else if (t2 >= 0) {
                        collisionTime = t2;
                    } else {
                        continue;
                    }

                    if (collisionTime <= elapsedTime) {
                        const position1: [number, number] = [physics1.previousX + physics1.previousVelocityX * collisionTime, physics1.previousY + physics1.previousVelocityY * collisionTime];
                        const position2: [number, number] = [(physics2?.previousX ?? entity2.x) + (physics2?.previousVelocityX ?? 0) * collisionTime, (physics2?.previousY ?? entity2.y) + (physics2?.previousVelocityY ?? 0) * collisionTime];

                        const collisionPoint = addVector(position2, setMagnitudeVector(subtractVector(position2, position1), radius2));

                        const message: CollisionMessage = {
                            type: 'collision',
                            entity1,
                            entity2,
                            collisionPoint,
                            time: collisionTime,
                            timeAfterCollision: elapsedTime - collisionTime,
                        };
                        messager(message);
                    }
                }
            }
        }
    };
}