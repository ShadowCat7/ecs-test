import { addEntity } from "../../../../sanguine/entities/entities.js";
import { getPrefab } from "../../../../sanguine/prefabs/prefabs.js";
import { Component, Message, System } from "../../../../sanguine/types.js";
import { EnemyDialogueComponent } from "../../../components/enemyDialogueComponent.js";
import { DialogueMessage } from "../../messageTypes.js";

export const enemyDialogueSystem = (
    messager: (message: Message) => void,
): System => {
    return {
        triggers: [{
            messageType: 'enemyDialogue',
            handler: (message: Message) => {
                const dialogueMessage = message as DialogueMessage;
                const { dialogueId } = dialogueMessage;

                const dialogue = ["hi what's your name"];

                // const fab = getPrefab('enemyDialogue');
                // const entity = fab.createEntity(0, 0);
                // addEntity(entity);

                // TODO animate text bubble growing
                // TODO animate text appearing

                // TODO set dialogue text
            }
        }],
        componentType: 'enemyDialogue',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components as EnemyDialogueComponent[]) {
                const { timer, current, index } = component;
                if (!current?.length) continue;

                component.timer += elapsedTime;

                const line = current?.[index];
                const currentLength = line?.length ?? 0;

                if (timer < 2) {
                    // text bubble growing or shrinking if closing
                    if (current?.length) {

                    } else {

                    }
                } else if (timer < 2 + currentLength * 0.1 + 2) {
                    const textIndex = Math.min(Math.floor((timer - 2) / 0.1), currentLength - 1);
                    const text = line.slice(0, textIndex);
                    // set textbox to text
                } else {
                    component.timer -= currentLength * 0.1 + 2;
                    component.index++;

                    if (component.index === current.length) {
                        // set textbox to empty
                        // close textbox
                        component.index = 0;
                        component.timer -= 2;
                    } else {
                    }
                }
            }
        },
    };
}