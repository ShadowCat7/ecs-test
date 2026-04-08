import { Component, Message, System } from "../../sanguine/types.js";

export const gridSystem = (
    messager: (message: Message) => void,
): System => {
    // initialization logic here

    return {
        triggers: [{
            messageType: "example",
            handler: function (message: Message): void {
                throw new Error("Function not implemented.");
            }
        }],
        componentType: 'example',
        process: (components: Component[], elapsedTime: number) => {
            for (let component of components) {
                throw new Error("Function not implemented.");
            }
        },
    };
}