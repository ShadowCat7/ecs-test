import { Component, Message, System } from "../../../../sanguine/types.js";
import { PlayMessage } from "../../messageTypes.js";

export const cardEffectSystem = (): System => {
    return {
        triggers: [{
            messageType: 'play',
            handler: (message: Message) => {
                const { entity } = message as PlayMessage;
                
                console.log(entity?.id);
            }
        }],
        componentType: 'cardEffect',
        process: (components: Component[], elapsedTime: number) => {
        },
    };
}