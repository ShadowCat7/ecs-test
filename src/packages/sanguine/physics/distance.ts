import { hypotenuse } from "./triangle.js";

export const distance = (x1: number, y1: number, x2: number, y2: number) => hypotenuse(x2 - x1, y2 - y1);

export const midpoint = (x1: number, y1: number, x2: number, y2: number): [number, number] => [x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2];