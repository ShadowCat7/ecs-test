import { Message } from "../../../sanguine/types.js";

export type CreateStampMessage = Message & {
    type: 'createStamp',
    prefab: string;
};

export type PlaceStampMessage = Message & {
    type: 'placeStamp',
};

export type OpenPanelMessage = Message & {
    type: 'openPanel',
    panelControl: string,
};

export type ClearPanelMessage = Message & {
    type: 'clearPanel',
    panelControl: string,
};

export type AddPropertiesMessage = Message & {
    type: 'addProperties',
    prefab: string,
};
