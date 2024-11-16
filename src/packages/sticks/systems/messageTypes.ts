import { Entity, Message } from "../../sanguine/types.js";

export type PlayMessage = Message & {
    entity: Entity,
}