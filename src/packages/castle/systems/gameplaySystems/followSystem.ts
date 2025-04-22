import { getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { setMagnitude } from "../../../sanguine/util/vector.js";
import { FollowComponent } from "../../components/followComponent.js";
import { CollideableComponent } from "../../components/collideableComponent.js";
import { getClosestPointOnCircle } from "../../../sanguine/physics/circle.js";

export const followSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        componentType: 'follow',
        process: (components: Component[], elapsedTime: number) => {
            for (const follow of components as FollowComponent[]) {
                const following = getEntity(follow.following);
                if (!following) {
                    removeEntity(follow.entityId);
                    continue;
                }

                const entity = getEntity(follow.entityId);

                const collider = entity.getComponent<CollideableComponent>('collideable');
                let radius = 0;
                if (collider) radius = collider.radius;

                let { x: targetX, y: targetY } = following;

                const followingCollider = following.getComponent<CollideableComponent>('collideable');
                if (followingCollider) {
                    [targetX, targetY] = getClosestPointOnCircle(entity.x, entity.y, targetX, targetY, followingCollider.radius);
                }

                if (radius) {
                    [targetX, targetY] = setMagnitude(targetX, targetY, radius * entity.scale + (followingCollider?.radius ?? 0) * following.scale);
                }

                const physics = entity.getComponent<PhysicsComponent>('physics')!;
                physics.moveToX = following.x + targetX;
                physics.moveToY = following.y + targetY;
            }
        }
    };
}