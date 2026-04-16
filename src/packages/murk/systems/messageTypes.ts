import { Entity, Message } from "../../sanguine/types.js";

export type ContainerAddMessage = Message & {
    type: 'containerAdd',
    containerId: string,
    entityId: string,
};

export type ContainerDeleteChildrenMessage = Message & {
    type: 'containerDeleteChildren',
    containerId: string,
};
