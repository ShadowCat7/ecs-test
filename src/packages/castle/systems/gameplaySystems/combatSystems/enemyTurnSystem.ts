import { getComponents, getEntity } from "../../../../sanguine/entities/entities.js";
import { TimerMessage } from "../../../../sanguine/messages.js";
import { Component, Message, System } from "../../../../sanguine/types.js";
import { randomInt } from "../../../../sanguine/util/random.js";
import { EnemyComponent } from "../../../components/enemyComponent.js";

export const enemyTurnSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [{
            messageType: 'beginEnemyTurn',
            handler: (message: Message) => {
                const timerMessage: TimerMessage = {
                    duration: 1.1,
                    responseType: 'enemyDecision',
                    type: 'timer',
                };

                messager(timerMessage);
            }
        },
        {
            messageType: 'enemyDecision',
            handler: (message: Message) => {
                const enemyComponents = getComponents('enemy') as EnemyComponent[];

                for (let component of enemyComponents) {
                    const entity = getEntity(component.entityId);

                    const playMessage = {
                        type: 'enemyPlay',
                        entity,
                    };

                    messager(playMessage);

                    messager({
                        type: 'endEnemyTurn',
                    });
                }
            }
        }],
        componentType: 'enemy',
        process: (components: Component[], elapsedTime: number) => {
        },
    };
}