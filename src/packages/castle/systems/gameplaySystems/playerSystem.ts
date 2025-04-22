import { addEntity, getComponents, getEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getControl } from "../../controls.js";
import { setMagnitude } from "../../../sanguine/util/vector.js";
import { FollowComponent } from "../../components/followComponent.js";
import { LevelUpMessage, PlayerEatMessage } from "./types.js";

export const playerSystem = (
    messager: (message: Message) => void,
): System => {
    let level = 1;

    // create player
    const player = createEntity(300, 300, getPrefab('head'));
    const physics = player.getComponent<PhysicsComponent>('physics')!;
    physics.velocityX = -physics.topSpeed;
    physics.velocityY = 0;
    addEntity(player);

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
                if (message.type === 'playerEat') {
                    const { amount } = message as PlayerEatMessage;
                    level += amount;
                    const levelUpMessage: LevelUpMessage = {
                        type: "levelUp",
                        level,
                    };
                    messager(levelUpMessage);
                }
                addToTail();
            },
        }],
        componentType: 'player',
        process: (components: Component[], elapsedTime: number) => {
            if (player) {
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