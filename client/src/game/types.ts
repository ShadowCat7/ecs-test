import { Dictionary } from "../util/utilTypes.js";

export type ControlHistoryItem = {
    previous: boolean,
    current: boolean,
}

export type ButtonControls = Dictionary<string, ControlHistoryItem>;

export type Controls = {
    mouse: [number, number],
    buttons: ButtonControls,
}

export type UpdateOptions = {
    controls: Controls,
    elapsedTime: number,
}

export type Mouse = {
    x: number,
    y: number,
    leftClick: boolean,
    rightClick: boolean,
}