export const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, scale: number = 1) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
    ctx.fill();
};