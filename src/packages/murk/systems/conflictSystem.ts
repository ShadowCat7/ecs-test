import { assertMessage } from "../../sanguine/messages.js";
import { Component, Message, System } from "../../sanguine/types.js";
import { ConflictMessage } from "./messageTypes.js";

export const gridSystem = (
    messager: (message: Message) => void,
): System => {
    // initialization logic here

    return {
        triggers: [{
            messageType: "conflict",
            handler: function (message: Message): void {
                assertMessage<ConflictMessage>(message, 'conflict');
                const { mover, obstacle } = message;
                
            }
        }],
        componentType: null,
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {
                throw new Error("Function not implemented.");
            }
        },
    };
}
