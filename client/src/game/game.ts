import { drawText } from './draw/drawText.js';
import { Engine, createEngine } from './engine.js';
// import loadImages from '../sprites/image-loader.js';
import { createControls } from './controls.js';
import { Mouse, UpdateOptions } from './types.js';

let engine: Engine | null = null;
const controls = createControls();

let spriteSheet = null;

export type ProvidedDraw = (ctx: CanvasRenderingContext2D, mouse: Mouse) => void;

const draw = (canvas: HTMLCanvasElement, providedDraw: ProvidedDraw) => (mouse: Mouse) => {
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    providedDraw(ctx, mouse);

    const fps = Math.round(engine?.getFps() ?? 0);

    // if should draw fps
    drawText(ctx, `${fps} fps`, 5, 5, {
        fontSize: 16,
    });
};

export type ProvidedUpdate = (options: UpdateOptions) => void;

const update = (providedUpdate: ProvidedUpdate) => (
    buttonsPressed: { [key: string]: boolean },
    mouse: Mouse,
    elapsedTime: number
) => {
    controls.update(buttonsPressed, mouse);

    providedUpdate({ controls: controls.getControls(), elapsedTime });
};

export const createGame = (
    canvas: HTMLCanvasElement,
    onLoad: () => void,
    providedUpdate: ProvidedUpdate,
    providedDraw: ProvidedDraw,
) => {
    document.addEventListener('DOMContentLoaded', () => {
        // spriteSheet = document.getElementById('sprite');

        // new Promise(loadImages).then(onLoad);
        engine = createEngine(canvas, update(providedUpdate), draw(canvas, providedDraw));
        engine.start();
    });
};