export const distance = (x1: number, y1: number, x2: number, y2: number) => pythagoras(x2 - x1, y2 - y1);

export const midpoint = (x1: number, y1: number, x2: number, y2: number) => [x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2];

const pythagoras = (a: number, b: number) => Math.sqrt(a * a + b * b);