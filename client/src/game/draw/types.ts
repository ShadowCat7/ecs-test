import { Entity, Mouse } from "../types.js"

export type DrawOptions = {
    ctx: CanvasRenderingContext2D,
    mouse: Mouse,
    x: number,
    y: number,
}

export type DrawInfo = {
    x: number,
    y: number,
};

export type Container = {
    children: DrawInfo[],
};

export type Renderer = {
    draw: (options: DrawOptions) => void,
}