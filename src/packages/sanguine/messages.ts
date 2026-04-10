import { ControlMessage, Message } from "./types.js";

export function assertMessage<T extends Message>(message: Message, type: T['type']): asserts message is T {
    if (message.type !== type) {
        console.error(`Emitted message type ${message.type} didn't match trigger type ${type}`);
        debugger;
        throw new Error(`Emitted message type ${message.type} didn't match trigger type ${type}`);
    }
}
