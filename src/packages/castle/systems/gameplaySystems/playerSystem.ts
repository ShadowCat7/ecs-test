import { addEntity, getComponents, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getControl } from "../../controls.js";
import { add, multiplyVector, project, projectVector, setMagnitude, setMagnitudeVector, subtractVector } from "../../../sanguine/util/vector.js";
import { FollowComponent } from "../../components/followComponent.js";
import { LevelDownMessage, LevelUpMessage, PlayerBouncedMessage, PlayerEatenMessage, PlayerEatMessage } from "./types.js";
import { SizeComponent } from "../../components/sizeComponent.js";
import { EdibleComponent } from "../../components/edibleComponent.js";
import { createTimer } from "../../../sanguine/util/timer.js";
import { getClosestPointOnCircle } from "../../../sanguine/physics/circle.js";
import { CollideableComponent } from "../../components/collideableComponent.js";

export const playerSystem = (
    messager: (message: Message) => void,
): System => {
    let level = 1;
    let nextCheckpoint = 2;
    let invincible = false;
    let iframeTimer = createTimer(0.3, () => {
        invincible = false;
    });

    // create player
    const player = createEntity(300, 300, getPrefab('head'));
    const physics = player.getComponent<PhysicsComponent>('physics')!;
    physics.velocityX = 0;
    physics.velocityY = physics.topSpeed;
    addEntity(player);

    
    const food = createEntity(300, 510, getPrefab('food'));
    addEntity(food);

    let lastHead = player.id;

    const addToTail = () => {
        let parent = getEntity(lastHead);

        if (!parent) {
            const follows = getComponents('follow') as FollowComponent[];
            const followsById = new Map(follows.map(x => [x.following, x]));
            const getLastHead = () => {
                const follower = followsById.get(lastHead);
                if (!follower) parent = getEntity(lastHead);
                else {
                    lastHead = follower.entityId;
                    getLastHead();
                }
            }
            lastHead = player.id;
            getLastHead();
        }

        const parentFollow = parent.getComponent<FollowComponent>('follow');
        const grandparent = getEntity(parentFollow?.following ?? '');

        const prefab = !grandparent ? 'neck' : 'tail';
        const x = !grandparent ? parent.x : (parent.x + parent.x - grandparent.x);
        const y = !grandparent ? parent.y : (parent.y + parent.y - grandparent.y);

        const [newX, newY] = setMagnitude(x - parent.x, y - parent.y, 1);

        const tail = createEntity(newX + parent.x, newY + parent.y, getPrefab(prefab));
        const follow = tail.getComponent<FollowComponent>('follow')!;
        follow.following = parent.id;
        addEntity(tail);
        lastHead = tail.id;

        const lastTailPhysics = parent.getComponent<PhysicsComponent>('physics')!;
        const tailPhysics = tail.getComponent<PhysicsComponent>('physics')!;
        tailPhysics.velocityX = lastTailPhysics.velocityX;
        tailPhysics.velocityY = lastTailPhysics.velocityY;
    }

    for (let i = 0; i < 1; i++) {
        addToTail();
    }

    return {
        triggers: [{
            messageType: 'playerEat',
            handler: (message: Message) => {
                if (message.type !== 'playerEat') return;
                const { amount } = message as PlayerEatMessage;
                level += amount;
                const levelUpMessage: LevelUpMessage = {
                    type: "levelUp",
                    level,
                };
                messager(levelUpMessage);
                if (level > nextCheckpoint) {
                    nextCheckpoint++;
                    addToTail();
                }
            },
        }, {
            messageType: 'playerEaten',
            handler: (message: Message) => {
                if (message.type !== 'playerEaten') return;
                if (invincible) return;
                const { eaten } = message as PlayerEatenMessage;
                const playerSize = player.getComponent<SizeComponent>('size')!;

                const follows = getComponents('follow') as FollowComponent[];
                const followsById = new Map(follows.map(x => [x.following, x]));

                let followerId = eaten.id;
                let tailSize = 1;
                while (followerId) {
                    const followComponent = followsById.get(followerId);
                    if (!followComponent) break;
                    tailSize++;
                    const followEntity = getEntity(followComponent.entityId);
                    const newFood = createEntity(followEntity.x, followEntity.y, getPrefab('food'));
                    newFood.getComponent<EdibleComponent>('edible')!.food = 1;
                    newFood.getComponent<SizeComponent>('size')!.size = playerSize.size;
                    removeEntity(followComponent.entityId);
                    addEntity(newFood);
                    followerId = followComponent.entityId;
                }

                const eatenFollower = eaten.getComponent<FollowComponent>('follow');
                if (eatenFollower)
                    lastHead = eatenFollower.following;

                console.log(tailSize)
                level -= tailSize;
                const levelUpMessage: LevelDownMessage = {
                    type: "levelDown",
                    level,
                };
                messager(levelUpMessage);
                iframeTimer.reset();
                invincible = true;
            },
        }, {
            messageType: 'playerBounced',
            handler: (message: Message) => {
                if (message.type !== 'playerBounced') return;
                const { collisionPoint, timeOfCollision, timeAfterCollision } = message as PlayerBouncedMessage;
                const playerPhysics = player.getComponent<PhysicsComponent>('physics')!;

                const playerCollisionX = playerPhysics.previousX + playerPhysics.previousVelocityX * timeOfCollision;
                const playerCollisionY = playerPhysics.previousY + playerPhysics.previousVelocityY * timeOfCollision;

                player.x = playerCollisionX;
                player.y = playerCollisionY;

                const normal = setMagnitudeVector(subtractVector(collisionPoint, [player.x, player.y]), 1);
                const [newVelocityX, newVelocityY] = projectVector(normal, [playerPhysics.velocityX, playerPhysics.velocityY]);
                playerPhysics.velocityX = playerPhysics.previousVelocityX - newVelocityX;
                playerPhysics.velocityY = playerPhysics.previousVelocityX - newVelocityY;

                player.x += playerPhysics.velocityX * timeAfterCollision;
                player.y += playerPhysics.velocityY * timeAfterCollision;

                if (invincible) return;
                level -= 1;
                const levelDownMessage: LevelDownMessage = {
                    type: "levelDown",
                    level,
                };
                messager(levelDownMessage);

                iframeTimer.reset();
                invincible = true;
            },
        }],
        componentType: 'player',
        process: (components: Component[], elapsedTime: number) => {
            if (player) {
                iframeTimer.update(elapsedTime);

                const physics = player.getComponent<PhysicsComponent>('physics')!;

                let [velocityX, velocityY] = setMagnitude(physics.velocityX, physics.velocityY, 1);

                if (getControl('left').current) {
                    velocityX -= elapsedTime * 10;
                }
                if (getControl('right').current) {
                    velocityX += elapsedTime * 10;
                }
                if (getControl('up').current) {
                    velocityY -= elapsedTime * 10;
                }
                if (getControl('down').current) {
                    velocityY += elapsedTime * 10;
                }

                if (getControl('map').current && !getControl('map').previous) {
                    level += 2;
                    addToTail();
                    addToTail();
                    const levelUpMessage: LevelUpMessage = {
                        type: "levelUp",
                        level,
                    };
                    messager(levelUpMessage);
                }

                const [newVelocityX, newVelocityY] = setMagnitude(velocityX, velocityY, physics.topSpeed * player.scale);
                if (newVelocityX !== 0 || newVelocityY !== 0) {
                    physics.velocityX = newVelocityX;
                    physics.velocityY = newVelocityY;
                }

                // if (Math.random() < 0.1) console.log(newVelocityX, newVelocityY)
            }
        }
    };
}