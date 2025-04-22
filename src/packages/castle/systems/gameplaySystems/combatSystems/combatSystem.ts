import { addEntity } from "../../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../../sanguine/types.js";

export const combatSystem = (
    messager: (message: Message) => void,
): System => {
    // get combatants
    // sort into turn order

    const turns: string[] = []; // entity IDs
    let currentRound = 0;
    let currentTurn = 0;

    const updateTurn = () => {
        currentTurn++;
        if (currentTurn >= turns.length) {
            currentTurn = 0;
            currentRound++;
        }

        console.log(turns[currentTurn])

        const message = {
            type: 'startTurn',
            entityId: turns[currentTurn],
        };

        messager(message);
    }

    let starting = true;

    return {
        triggers: [{
            messageType: 'endTurn',
            handler: (message: Message) => {
                updateTurn();
            }
        }],
        componentType: 'combat',
        process: (components: Component[], elapsedTime: number) => {
            if (starting) {
                updateTurn();
                starting = false;
            }
        },
    };
}