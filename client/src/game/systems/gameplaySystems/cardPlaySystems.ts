import { addSubscriber, sendMail } from "../../entities/mailbox.js";
import { Mailbox, Message } from "../../types.js";
import { cardEffectSystem } from "./cards/cardEffectSystem.js";
import { takeStickSystem } from "./cards/takeStickSystem.js";
import { cardSystem } from "./cardSystem.js";
import { enemyTurnSystem } from "./enemyTurnSystem.js";
import { flammableSystem } from "./flammableSystem.js";
import { growableSystem } from "./growableSystem.js";
import { physicsSystem } from "./physicsSystem.js"
import { waterSystem } from "./waterSystem.js";

let mailbox: Mailbox = {};

const messageSender = (message: Message) => sendMail(message, mailbox);

export const cardPlaySystems = () => {
    mailbox = {};

    const systems = [
        physicsSystem, cardSystem, enemyTurnSystem,
        flammableSystem, growableSystem, waterSystem,
        cardEffectSystem, takeStickSystem,
    ].map(x => x(messageSender));

    for (let system of systems) {
        if (!system.triggers?.length) continue;

        for (let trigger of system.triggers)
            addSubscriber(mailbox, trigger.messageType, trigger.handler);
    }

    return systems;
}