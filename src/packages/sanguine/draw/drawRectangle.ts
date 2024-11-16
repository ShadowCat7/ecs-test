export const drawRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

export const drawRectangleOutline = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, outline: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = outline;
    ctx.strokeRect(x, y, width, height);
};