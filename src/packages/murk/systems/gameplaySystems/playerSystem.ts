import { addEntity } from "../../../sanguine/entities/entities.js";
import { Component, Message, System } from "../../../sanguine/types.js";
import { createEntity } from "../../../sanguine/entities/entity.js";
import { getPrefab } from "../../../sanguine/prefabs/prefabs.js";
import { PhysicsComponent } from "../../components/physicsComponent.js";
import { getControl } from "../../controls.js";
import { createTimer } from "../../../sanguine/util/timer.js";

const MOVEMENT_DURATION = 0.2;

export const playerSystem = (
    messager: (message: Message) => void,
): System => {
    let moving = false;
    let movementTimer = createTimer(MOVEMENT_DURATION, () => {
        moving = false;
    });

    // create player
    const player = createEntity(200, 200, getPrefab('head'));
    const physics = player.getComponent<PhysicsComponent>('physics')!;
    physics.velocityX = 0;
    physics.velocityY = 0;
    addEntity(player);

    return {
        triggers: [],
        componentType: 'player',
        process: (components: Component[], elapsedTime: number) => {
            if (player) {
                movementTimer.update(elapsedTime);

                const physics = player.getComponent<PhysicsComponent>('physics')!;

                // check held down vs pressing repeatedly
                if (moving) {
                    return;
                }

                const { x, y } = player;
                let directionX = 0;
                let directionY = 0;

                if (getControl('left').current) {
                    directionX--;
                } else if (getControl('right').current) {
                    directionX++;
                } else if (getControl('up').current) {
                    directionY--;
                } else if (getControl('down').current) {
                    directionY++;
                }

                if (directionX !== 0) {
                    physics.moveToX = x + directionX * 30;
                    physics.moveToY = y;
                } else if (directionY !== 0) {
                    physics.moveToX = x;
                    physics.moveToY = y + directionY * 30;
                }

                if (directionX || directionY) {
                    moving = true;
                    movementTimer.reset();
                }
            }
        }
    };
}