import { Entity, Message } from "../../../sanguine/types.js";

export type CollisionMessage = Message & {
    entity1: Entity,
    entity2: Entity,
    collisionPoint: [number, number],
    time: number,
    timeAfterCollision: number,
};

export type DialogueAddMessage = Message & {
    type: 'dialogueAdd',
    text: string,
};

export type DialogueReadyMessage = Message & {
    type: 'dialogueReady',
};
