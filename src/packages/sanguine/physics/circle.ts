import { setMagnitude } from "../util/vector.js";
import { distance } from "./distance.js";

export const isPointInCircle = (x1: number, y1: number, x2: number, y2: number, radius: number) => {
    return distance(x1, y1, x2, y2) <= radius;
};

export const areCirclesIntersecting = (
    x1: number,
    y1: number,
    radius1: number,
    x2: number,
    y2: number,
    radius2: number,
) => {
    return distance(x1, y1, x2, y2) < radius1 + radius2;
};

export const getClosestPointOnCircle = (
    x1: number,
    y1: number,
    circleX: number,
    circleY: number,
    radius: number
) => {
    return setMagnitude(x1 - circleX, y1 - circleY, radius);
};
