import { addEntity, getComponents, getEntity, removeEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getControl } from "../../controls.js";
import { projectVector, setMagnitude, setMagnitudeVector, subtractVector } from "../../../sanguine/util/vector.js";
import { LevelDownMessage, LevelUpMessage, PlayerBouncedMessage, PlayerEatenMessage, PlayerEatMessage } from "./types.js";
import { createTimer } from "../../../sanguine/util/timer.js";

export const playerSystem = (
    messager: (message: Message) => void,
): System => {
    // create player
    const player = createEntity(300, 300, getPrefab('head'));
    const physics = player.getComponent<PhysicsComponent>('physics')!;
    physics.velocityX = 0;
    physics.velocityY = physics.topSpeed;
    addEntity(player);

    return {
        triggers: [
        ],
        componentType: 'player',
        process: (components: Component[], elapsedTime: number) => {
            if (!player) return;
            const physics = player.getComponent<PhysicsComponent>('physics')!;

            let [velocityX, velocityY] = setMagnitude(physics.velocityX, physics.velocityY, 1);

            let newX = 0;
            let newY = 0;

            if (getControl('left').current) {
                newX -= elapsedTime * 10;
            }
            if (getControl('right').current) {
                newX += elapsedTime * 10;
            }
            if (getControl('up').current) {
                newY -= elapsedTime * 10;
            }
            if (getControl('down').current) {
                newY += elapsedTime * 10;
            }

            if (!newX && !newY) {
                physics.velocityX = 0;
                physics.velocityY = 0;
            } else {
                const [newVelocityX, newVelocityY] = setMagnitude(velocityX + newX, velocityY + newY, physics.topSpeed * player.scale);
                if (newVelocityX !== 0 || newVelocityY !== 0) {
                    physics.velocityX = newVelocityX;
                    physics.velocityY = newVelocityY;
                }
            }
        };
    };
};