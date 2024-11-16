import { repeat } from "../../../../sanguine/util/array.js";
import { randomInt, seededInt } from "../../../../sanguine/util/random.js";
import { TakeStickComponent } from "../../../components/cards/takeStickComponent.js";
import { PhysicsComponent } from "../../../components/physicsComponent.js";
import { data } from "../../../types.js";
import { addEntity, getEntity, removeEntity } from "../../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../../sanguine/types.js";
import { PlayMessage } from "../../messageTypes.js";

export const takeStickSystem = (): System => {
    const sticks = 12 + seededInt(3) * 2;
    data.currentRoom.sticks = sticks;

    const stickFab = getPrefab('stick');

    const stickEntityIds: string[] = [];

    // TODO sticks not overlapping too much
    repeat(sticks, () => {
        const entity = stickFab.createEntity(randomInt(400) + 200, randomInt(100) + 100);
        entity.rotation = Math.PI * 2 * Math.random();
        stickEntityIds.push(entity.id);
        addEntity(entity);
    });

    let stickIndex = 0;

    const handleTakeSticks = (sticks: number) => {
        data.currentRoom.sticks -= sticks;

        for (let i = 0; i < sticks && stickIndex + i < stickEntityIds.length; i++) {
            const entity = getEntity(stickEntityIds[stickIndex + i]);
            const physicsComponent = entity.getComponent('physics') as PhysicsComponent;
            physicsComponent.moveToX = 400;
            physicsComponent.moveToY = 500;
            // removeEntity(stickEntityIds[stickIndex + i]);
        }

        stickIndex += sticks;
    }

    return {
        triggers: [{
            messageType: 'play',
            handler: (message: Message) => {
                const { entity } = message as PlayMessage;

                const takeStick = entity?.getComponent<TakeStickComponent>('takeStick');
                if (!takeStick) return;

                handleTakeSticks(takeStick.sticks);
            }
        }, {
            messageType: 'enemyPlay',
            handler: (message: Message) => {
                const { entity } = message as PlayMessage;
                const takeStick = entity.getComponent<TakeStickComponent>('takeStick');
                if (!takeStick) return;

                handleTakeSticks(takeStick.sticks);
            }
        }],
        componentType: 'takeStick',
        process: (components: Component[], elapsedTime: number) => {

        },
    };
}