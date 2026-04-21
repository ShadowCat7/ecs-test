import { Message } from "../../../sanguine/types.js";

export type CreateStampMessage = Message & {
    type: 'createStamp',
    prefab: string;
};

export type PlaceStampMessage = Message & {
    type: 'placeStamp',
};
