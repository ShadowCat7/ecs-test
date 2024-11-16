import { Entity, Mailbox, Message, Subscriber } from "../types.js";

export const sendMail = (message: Message, mailbox: Mailbox) => {
    const subscribers = mailbox[message.type];

    if (!subscribers?.length) return;

    for (const subscriber of subscribers) {
        subscriber(message);
    }
}

export const addSubscriber = (mailbox: Mailbox, messageType: string, subscriber: Subscriber) => {
    let subscription = mailbox[messageType];
    if (!subscription) {
        subscription = [];
        mailbox[messageType] = subscription;
    }

    subscription.push(subscriber);
}