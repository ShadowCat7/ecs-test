import { addEntity } from "../../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../../sanguine/types.js";
import { StartCombatMessage, StartTurnMessage } from "../../messageTypes.js";

export const combatantSystem = (
    messager: (message: Message) => void,
): System => {
    let turns: string[] | null = null;
    let turnIndex: number = 0;
    let currentTurn: string | null = null;

    return {
        triggers: [{
            messageType: 'startCombat',
            handler: (message: Message) => {
                turns = (message as StartCombatMessage).entityIds;
                turnIndex = 0;
                currentTurn = turns[turnIndex];
            }
        }, {
            messageType: 'startTurn',
            handler: (message: Message) => {
                currentTurn = (message as StartTurnMessage).entityId;
            }
        }],
        componentType: 'combatant',
        process: (components: Component[], elapsedTime: number) => {
            // state machine script? management
        },
    };
}