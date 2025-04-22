import { hypotenuse } from "../physics/triangle.js";

export const setMagnitude = (x: number, y: number, newMagnitude: number) => {
    const currentMagnitude = hypotenuse(x, y);
    const ratio = currentMagnitude === 0 ? newMagnitude : newMagnitude / currentMagnitude;
    return [x * ratio, y * ratio];
}

export const maxMagnitude = (x: number, y: number, maxMagnitude: number) => {
    const currentMagnitude = hypotenuse(x, y);
    if (maxMagnitude >= currentMagnitude)
        return [x, y];

    return setMagnitude(x, y, maxMagnitude);
}