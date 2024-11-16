import { addSubscriber, sendMail } from "../../entities/mailbox.js";
import { Mailbox, Message } from "../../types.js";
import { cardEffectSystem } from "./cards/cardEffectSystem.js";
import { takeStickSystem } from "./cards/takeStickSystem.js";
import { physicsSystem } from "./physicsSystem.js"

let mailbox: Mailbox = {};

const messageSender = (message: Message) => sendMail(message, mailbox);

export const roomPlaySystems = () => {
    mailbox = {};

    const systems = [
        physicsSystem
    ].map(x => x(messageSender));

    for (let system of systems) {
        if (!system.triggers?.length) continue;

        for (let trigger of system.triggers)
            addSubscriber(mailbox, trigger.messageType, trigger.handler);
    }

    return systems;
}