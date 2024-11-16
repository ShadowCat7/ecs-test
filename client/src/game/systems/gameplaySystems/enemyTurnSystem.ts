import { getEntity } from "../../entities/entities.js";
import { Component, Message, System } from "../../types.js";

export const enemyTurnSystem = (
    messager: (message: Message) => void,
): System => {
    let isEnemyTurn = false;

    return {
        triggers: [{
            messageType: 'beginEnemyTurn',
            handler: (message: Message) => {
                isEnemyTurn = true;
            }
        }],
        componentType: 'enemy',
        process: (components: Component[], elapsedTime: number) => {
            if (!isEnemyTurn) return;

            for (let component of components) {
                const entity = getEntity(component.entityId);

                const message = {
                    type: 'enemyPlay',
                    entity,
                };

                messager(message);
            }

            isEnemyTurn = false;

            messager({
                type: 'beginPlayerTurn',
            });
        },
    };
}