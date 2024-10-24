import { Controls, Mouse } from "../types.js";

export type Entity = {
    getData: () => EntityData,
    draw: (options: EntityDrawOptions) => void,
    update: (options: EntityUpdateOptions) => void,
}

export type EntityData = {
    x: number,
    y: number,
};

export type EntityDrawOptions = {
    ctx: CanvasRenderingContext2D,
    mouse: Mouse,
};

export type EntityUpdateOptions = {
    elapsedTime: number,
    controls: Controls,
    entities: Entity[],
};

export type Component<T extends EntityData> = {
    update: (data: T, options: EntityUpdateOptions) => void,
    draw: (data: T, options: EntityDrawOptions) => void,
    start?: (data: T) => void,
}