export const isPointInRectangle = (x1: number, y1: number, x2: number, y2: number, width: number, height: number) => {
    return x1 >= x2
        && y1 >= y2
        && x1 <= x2 + width
        && y1 <= y2 + height;
}