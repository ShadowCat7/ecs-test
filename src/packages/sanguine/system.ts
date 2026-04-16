import { assertMessage } from "./messages.js";
import { Message } from "./types.js";

export const createTrigger = <T extends Message>(type: T['type'], handler: (message: T) => void) => {
    return {
        messageType: type,
        handler: (message: Message) => {
            assertMessage<T>(message, type);
            handler(message);
        },
    };
};
