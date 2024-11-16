import { Entity, Message } from "../types.js";

export type PlayMessage = Message & {
    entity: Entity,
}