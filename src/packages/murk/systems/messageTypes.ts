import { Entity, Message } from "../../sanguine/types.js";

export type ConflictMessage = Message & {
    type: 'conflict',
    mover: Entity,
    obstacle: Entity,
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