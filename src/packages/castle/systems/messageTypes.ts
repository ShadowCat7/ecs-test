import { Entity, Message } from "../../sanguine/types.js";

export type PlayMessage = Message & {
    entity: Entity,
}

export type DialogueMessage = Message & {
    dialogueId: string,
}

export type StartCombatMessage = Message & {
    entityIds: string[],
}

export type StartTurnMessage = Message & {
    entityId: string,
}