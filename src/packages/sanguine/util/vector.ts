import { hypotenuse } from "../physics/triangle.js";

export const addVector = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number] => {
    return [x1 + x2, y1 + y2];
}
export const add = (x1: number, y1: number, x2: number, y2: number): [number, number] => {
    return [x1 + x2, y1 + y2];
}

export const subtractVector = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number] => {
    return [x1 - x2, y1 - y2];
}
export const subtract = (x1: number, y1: number, x2: number, y2: number): [number, number] => {
    return [x1 - x2, y1 - y2];
}

export const multiplyVector = ([x1, y1]: [number, number], scalar: number): [number, number] => {
    return [x1 * scalar, y1 * scalar];
}
export const multiply = (x1: number, y1: number, scalar: number): [number, number] => {
    return [x1 * scalar, y1 * scalar];
}

export const project = (x: number, y: number, projectionX: number, projectionY: number): [number, number] => {
    const numerator = x * projectionX + y * projectionY;
    const denominator = x * x + y * y;
    return [numerator / denominator * x, numerator / denominator * y];
}
export const projectVector = ([x, y]: [number, number], [projectionX, projectionY]: [number, number]): [number, number] => {
    const numerator = x * projectionX + y * projectionY;
    const denominator = x * x + y * y;
    return [numerator / denominator * x, numerator / denominator * y];
}

export const setMagnitude = (x: number, y: number, newMagnitude: number): [number, number] => {
    const currentMagnitude = hypotenuse(x, y);
    const ratio = currentMagnitude === 0 ? newMagnitude : newMagnitude / currentMagnitude;
    return [x * ratio, y * ratio];
}

export const setMagnitudeVector = ([x, y]: [number, number], newMagnitude: number): [number, number] => {
    const currentMagnitude = hypotenuse(x, y);
    const ratio = currentMagnitude === 0 ? newMagnitude : newMagnitude / currentMagnitude;
    return [x * ratio, y * ratio];
}

export const maxMagnitude = (x: number, y: number, maxMagnitude: number): [number, number] => {
    const currentMagnitude = hypotenuse(x, y);
    if (maxMagnitude >= currentMagnitude)
        return [x, y];

    return setMagnitude(x, y, maxMagnitude);
}

export const reduceMagnitude = (x: number, y: number, reduction: number, max?: number): [number, number] => {
    const currentMagnitude = hypotenuse(x, y);
    let newMagnitude = currentMagnitude - reduction;
    if (max !== undefined && newMagnitude < max) newMagnitude = max;
    return setMagnitude(x, y, currentMagnitude);
}