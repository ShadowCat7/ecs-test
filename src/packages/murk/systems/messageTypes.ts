import { Message } from "../../sanguine/types.js";

export type ContainerAddMessage = Message & {
    type: 'containerAdd',
    containerId: string,
    entityId: string,
};

export type ContainerScrollMessage = Message & {
    type: 'containerScroll',
    containerId: string,
    scroll: number,
};

export type ContainerDeleteChildrenMessage = Message & {
    type: 'containerDeleteChildren',
    containerId: string,
};
